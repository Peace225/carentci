-- Migration : ajout des colonnes promo_code, promo_discount, driver_type dans reservations
-- À exécuter une seule fois en base de données

ALTER TABLE reservations
  ADD COLUMN IF NOT EXISTS driver_type VARCHAR(20) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS promo_code VARCHAR(50) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS promo_discount INT(11) DEFAULT 0;
