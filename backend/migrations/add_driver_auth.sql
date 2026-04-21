-- Migration : ajout des colonnes d'autorisation sans chauffeur
-- À exécuter une seule fois en base de données

ALTER TABLE vehicles
  ADD COLUMN autorise_sans_chauffeur_abidjan TINYINT(1) NOT NULL DEFAULT 1,
  ADD COLUMN autorise_sans_chauffeur_hors_abidjan TINYINT(1) NOT NULL DEFAULT 1;
