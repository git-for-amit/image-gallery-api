DROP TABLE IF EXISTS `Users`;
CREATE TABLE `Users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `firstName` varchar(255) DEFAULT NULL,
  `lastName` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `approved` varchar(3) DEFAULT 'no',
  PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `Images`;

CREATE TABLE `Images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `path` varchar(2000) DEFAULT NULL,
  `filename` varchar(2000) DEFAULT NULL,
  `attributes` varchar(5000) DEFAULT NULL,
  `code` varchar(1000) DEFAULT NULL,
  `categoryname` varchar(2000) DEFAULT NULL,
  `subcategoryname` varchar(2000) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ;

DROP TABLE IF EXISTS `UserImages`;

CREATE TABLE `UserImages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userid` int DEFAULT NULL,
  `imageid` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userid` (`userid`),
  KEY `imageid` (`imageid`),
  CONSTRAINT `user_images_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `Users` (`id`),
  CONSTRAINT `user_images_ibfk_2` FOREIGN KEY (`imageid`) REFERENCES `Images` (`id`)
);