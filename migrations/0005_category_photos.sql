-- Category tile photo (R2 key) and the small caption shown under the name.
ALTER TABLE categories ADD COLUMN photo_key TEXT;
ALTER TABLE categories ADD COLUMN note TEXT NOT NULL DEFAULT '';

UPDATE categories SET note = 'Packs & bulk' WHERE slug = 'jerky';
UPDATE categories SET note = 'Smoked & raw' WHERE slug = 'steaks';
UPDATE categories SET note = 'For sharing' WHERE slug = 'boards';
UPDATE categories SET note = 'Ready to eat' WHERE slug = 'smoked';
UPDATE categories SET note = 'Fresh cuts' WHERE slug = 'non-smoked';
