CREATE  TABLE `USERS` (
  `id` VARCHAR(30) NOT NULL,
  `email` VARCHAR(45) NOT NULL ,
  `password` VARCHAR(45) NULL ,
  `nickname` VARCHAR(45) NOT NULL ,
  `sns_type` VARCHAR(10)  NULL,
  `sns_id` VARCHAR(255) NULL ,
  `sns_profile` VARCHAR(255)  NULL,
  `create_date` DATETIME NOT NULL ,
  PRIMARY KEY (`id`));