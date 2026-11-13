ALTER TABLE orders ADD COLUMN gift_from TEXT;
ALTER TABLE print_jobs ADD COLUMN kind TEXT NOT NULL DEFAULT 'label';
ALTER TABLE print_jobs ADD COLUMN payload TEXT; -- JSON the Pi uses to draw the card, e.g. {"message":"...","from":"..."}
