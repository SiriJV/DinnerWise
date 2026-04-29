DELIMITER //

DROP PROCEDURE IF EXISTS ensure_unique_clerk_user_id //

CREATE PROCEDURE ensure_unique_clerk_user_id()
BEGIN
  DECLARE idx_count INT DEFAULT 0;

  SELECT COUNT(*) INTO idx_count
    FROM information_schema.STATISTICS
   WHERE TABLE_SCHEMA = DATABASE()
     AND TABLE_NAME   = 'account_users'
     AND COLUMN_NAME  = 'clerk_user_id'
     AND NON_UNIQUE   = 0;

  IF idx_count = 0 THEN
    ALTER TABLE account_users
      ADD UNIQUE INDEX uq_clerk_user_id (clerk_user_id);
    SELECT 'Added UNIQUE constraint on clerk_user_id' AS result;
  ELSE
    SELECT 'UNIQUE constraint already exists on clerk_user_id' AS result;
  END IF;
END //

DELIMITER ;

CALL ensure_unique_clerk_user_id();
DROP PROCEDURE IF EXISTS ensure_unique_clerk_user_id;