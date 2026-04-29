import { Router, Request, Response } from 'express';
import { clerkClient, getAuth } from '@clerk/express';
import * as accountService from '../services/accountUserService.js';
import { db } from '../db.js';

const router = Router();

router.get('/resolve-target', async (req: Request, res: Response) => {
  const alias = typeof req.query.alias === 'string' ? req.query.alias.trim() : '';
  const legacyUserId = Number(req.query.legacyUserId);
  const name = typeof req.query.name === 'string' ? req.query.name.trim() : '';

  try {
    if (Number.isInteger(legacyUserId) && legacyUserId > 0) {
      const [byIdRows]: any[] = await db.query(
        `SELECT id FROM account_users WHERE id = ? LIMIT 1`,
        [legacyUserId]
      );

      if (Array.isArray(byIdRows) && byIdRows.length > 0) {
        return res.status(200).json({
          success: true,
          accountUserId: byIdRows[0].id,
          source: 'legacy-id',
        });
      }
    }

    if (name) {
      const [nameRows]: any[] = await db.query(
        `
        SELECT id
        FROM account_users
        WHERE LOWER(TRIM(CONCAT(COALESCE(first_name, ''), ' ', COALESCE(last_name, '')))) = LOWER(TRIM(?))
        LIMIT 1
        `,
        [name]
      );

      if (Array.isArray(nameRows) && nameRows.length > 0) {
        return res.status(200).json({
          success: true,
          accountUserId: nameRows[0].id,
          source: 'name',
        });
      }
    }

    if (alias) {
      const normalizedAlias = alias.toLowerCase().replace(/[^a-z0-9]/g, '');
      const [aliasRows]: any[] = await db.query(
        `
        SELECT id
        FROM account_users
        WHERE REPLACE(REPLACE(LOWER(SUBSTRING_INDEX(email, '@', 1)), '.', ''), '_', '') = ?
        LIMIT 1
        `,
        [normalizedAlias]
      );

      if (Array.isArray(aliasRows) && aliasRows.length > 0) {
        return res.status(200).json({
          success: true,
          accountUserId: aliasRows[0].id,
          source: 'alias-email',
        });
      }
    }

    return res.status(404).json({ error: 'Användaren hittades inte' });
  } catch (error) {
    console.error('[user-report] resolve-target error:', error);
    return res.status(500).json({ error: 'Kunde inte hitta rapporterbar användare' });
  }
});

router.post('/:userId/report', async (req: Request, res: Response) => {
  const { userId } = req.params;
  const incomingUserId = Number(userId);

  if (!Number.isInteger(incomingUserId) || incomingUserId <= 0) {
    return res.status(400).json({ error: 'Ogiltigt användar-ID' });
  }

  const reason = typeof req.body?.reason === 'string' ? req.body.reason.trim() : null;
  const normalizedReason = reason && reason.length > 0 ? reason : null;

  let resolvedAccountUserId: number | null = null;

  try {
    const [directLookup]: any[] = await db.query(
      'SELECT id FROM account_users WHERE id = ? LIMIT 1',
      [incomingUserId]
    );

    if (Array.isArray(directLookup) && directLookup.length > 0) {
      resolvedAccountUserId = directLookup[0].id;
    } else {
      const [legacyUser]: any[] = await db.query(
        'SELECT id, name FROM users WHERE id = ? LIMIT 1',
        [incomingUserId]
      );

      if (Array.isArray(legacyUser) && legacyUser.length > 0) {
        const legacyName = legacyUser[0].name;

        const [nameMatch]: any[] = await db.query(
          `
          SELECT id
          FROM account_users
          WHERE LOWER(TRIM(CONCAT(COALESCE(first_name, ''), ' ', COALESCE(last_name, '')))) = LOWER(TRIM(?))
          LIMIT 1
          `,
          [legacyName]
        );

        if (Array.isArray(nameMatch) && nameMatch.length > 0) {
          resolvedAccountUserId = nameMatch[0].id;
        }
      }
    }

    if (resolvedAccountUserId === null) {
      return res.status(404).json({
        error: 'Användaren finns inte i account_users än. Användarens profil har möjligt inte synkats till det nya systemet.',
      });
    }

    await db.query(`
      CREATE TABLE IF NOT EXISTS user_reports (
        id INT AUTO_INCREMENT PRIMARY KEY,
        reported_account_user_id INT NOT NULL,
        reported_by_account_user_id INT NULL,
        reason TEXT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_user_reports_reported_user (reported_account_user_id),
        INDEX idx_user_reports_reporter (reported_by_account_user_id),
        CONSTRAINT fk_user_reports_reported_user
          FOREIGN KEY (reported_account_user_id)
          REFERENCES account_users(id)
          ON DELETE CASCADE,
        CONSTRAINT fk_user_reports_reporter
          FOREIGN KEY (reported_by_account_user_id)
          REFERENCES account_users(id)
          ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await db.query(
      `
      INSERT INTO user_reports (
        reported_account_user_id,
        reported_by_account_user_id,
        reason,
        created_at
      ) VALUES (?, NULL, ?, NOW())
      `,
      [resolvedAccountUserId, normalizedReason]
    );

    return res.status(200).json({
      success: true,
      message: 'Användaren har rapporterats',
    });
  } catch (error: any) {
    console.error('[user-report] SQL error:', error);
    return res.status(500).json({ error: 'Kunde inte rapportera användaren' });
  }
});

export default router;