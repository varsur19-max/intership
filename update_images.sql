-- Run only if products.image_data / products.image_mime are missing.
-- Select the existing project database first. Existing rows are preserved.
SET @q = IF(EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'products' AND column_name = 'image_data'), 'SELECT 1', 'ALTER TABLE products ADD COLUMN image_data MEDIUMBLOB NULL');
PREPARE image_update FROM @q;
EXECUTE image_update;
DEALLOCATE PREPARE image_update;
SET @q = IF(EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'products' AND column_name = 'image_mime'), 'SELECT 1', 'ALTER TABLE products ADD COLUMN image_mime VARCHAR(32) NULL');
PREPARE image_update FROM @q;
EXECUTE image_update;
DEALLOCATE PREPARE image_update;
