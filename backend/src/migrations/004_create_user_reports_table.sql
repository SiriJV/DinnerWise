CREATE TABLE IF NOT EXISTS user_reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  reported_account_user_id INT NOT NULL,
  reported_by_account_user_id INT NULL,
  reason VARCHAR(500) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_user_reports_reported_user (reported_account_user_id),
  INDEX idx_user_reports_reporter (reported_by_account_user_id),
  INDEX idx_user_reports_created_at (created_at),

  CONSTRAINT fk_user_reports_reported_user
    FOREIGN KEY (reported_account_user_id)
    REFERENCES account_users(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_user_reports_reporter
    FOREIGN KEY (reported_by_account_user_id)
    REFERENCES account_users(id)
    ON DELETE SET NULL
);
