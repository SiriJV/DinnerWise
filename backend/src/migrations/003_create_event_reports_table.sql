CREATE TABLE IF NOT EXISTS event_reports (
  id INT PRIMARY KEY AUTO_INCREMENT,
  event_id INT NOT NULL,
  reported_by_account_user_id INT NULL,
  reason VARCHAR(500),
  status ENUM('open', 'reviewing', 'resolved', 'dismissed') NOT NULL DEFAULT 'open',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  CONSTRAINT fk_event_reports_event_id 
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  CONSTRAINT fk_event_reports_account_user_id 
    FOREIGN KEY (reported_by_account_user_id) REFERENCES account_users(id) ON DELETE SET NULL,
  
  UNIQUE KEY uk_event_user_open_report (event_id, reported_by_account_user_id, status),
  
  INDEX idx_event_id (event_id),
  INDEX idx_reported_by_account_user_id (reported_by_account_user_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
