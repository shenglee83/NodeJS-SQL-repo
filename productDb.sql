--
-- Database: `productdb`
--
CREATE DATABASE IF NOT EXISTS `productdb`;
USE `productdb`;

-- --------------------------------------------------------

--
-- Table structure 
--

CREATE TABLE IF NOT EXISTS `brand` (
  `b_id` int(11) NOT NULL AUTO_INCREMENT,
  `b_name` varchar(50) NOT NULL,
  `description` varchar(200) NOT NULL,
  
  PRIMARY KEY (`b_id`)
);

CREATE TABLE IF NOT EXISTS `product` (
  `p_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `brand_ID` int(11) NOT NULL,
  'description' varchar(250) NOT NULL,
  'price' decimal(5,2) NOT NULL,
  'colour' varchar(20) NOT NULL,
  'date_created' date NOT NULL,
  'availability_status' varchar(30) NOT NULL
  
  PRIMARY KEY (`p_id`),
  FOREIGN KEY ('brand_ID') REFERENCES brand('b_id')
);
CREATE TABLE IF NOT EXISTS `user` (
  `u_id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(20) NOT NULL,
  `u_name` varchar(50) NOT NULL,
  'email' varchar(100) NOT NULL UNIQUE,
  'date_of_birth' date NOT NULL

  PRIMARY KEY (`u_id`)
);

CREATE TABLE IF NOT EXISTS `review` (
  `r_id` int(11) NOT NULL AUTO_INCREMENT,
  `rating` int(11) NOT NULL,
  `product_id` varchar(11) NOT NULL,
  'comment' varchar(255) NOT NULL,
  'user_id' int(11) NOT NULL

   PRIMARY KEY (`b_id`)
   FOREIGN KEY ('product_id') REFERENCES product('p_id'),
   FOREIGN KEY ('user_id') REFERENCES user('u_id')
);
--
-- Dumping data for table `brand`
--

INSERT INTO `brand`
(`b_id`, `b_name`, `description`)
VALUES
(1, "Passembong", "Booklet product expert."),
(2, "Houssenberg", "Only the finest brewed allowed."),
(3, "Chevrolet car", "Chevrolet mini car figures."),
(4, "Ford car", "Ford mini car figures.");


INSERT INTO `review`
(`r_id`, `rating`, `product_id`, `comment`, `user_id`)
VALUES
('1', '10', '1', 'Excellent product', '1'),
('2', '10', '2', 'A very good product. I like it alot', '1'),
('3', '8', '2', 'I truly love this product', '1'),
('4', '8', '7', 'I truly love this product', '1'),
('5', '9', '4', 'Wow.. i love this item', '3'),
('6', '9', '5', 'unbelievably good', '2');

INSERT INTO `user`
(`u_id`, `type`, `u_name`, `email`, `date_of_birth`)
VALUES
('1', 'customer', 'Rick', 'rick@test.com', '1985-03-04'),
('2', 'customer', 'Lee', 'Lee@test.com', '1984-03-04'),
('3', 'customer', 'JY', 'jy@test.com', '1984-03-04'),
('4', 'Merchant', 'Kaneka', 'kaneka@test.com', '1984-03-04');

INSERT INTO `product`
('p_id', 'name', 'brand_ID', 'description', 'price', 'colour', 'date_created', 'availability_status')
VALUES
('1', 'Passport Booklet', '1', 'Passport booklet', '12.00', 'red', '2016-01-13', 'In Stock'),
('2', 'Scotch', '2', 'Another well brewed drink from Houssenberg', '24.00', 'Nan', '2015-11-01', 'In Stock'),
('3', 'Mini Bumblebee', '3', 'Mini Bumblebee car figure', '56.00', 'yellow and black', '2014-01-01', 'In Stock'),
('4', 'Ygorddin', '2', 'Another must try from Houssenberg', '50.00', 'Clear', '2015-01-13', 'In Stock'),
('5', 'Van HaulSing', '2', 'Another must try from Houssenberg', '60.00', 'Clear', '2015-01-13', 'In Stock'),
('6', 'Red Bumblebee', '3', 'Mini Bumblebee car figure', '50.00', 'Red', '2014-01-01', 'In Stock'),
('7', 'Booklet Mini', '1', 'Notebooklet from Passenbong', '30.00', 'Dark Brown', '2015-11-11', 'In Stock'),
('8', 'Scottish Wishky', '2', 'Another must try from Houssenberg', '50.00', 'Clear', '2015-01-13', 'In Stock'),
('9', 'Mini Ranger', '4', 'Ford Ranger figurine. Scale 1:90', '50.00', 'Blue', '2015-04-13', 'In Stock'),
('10', 'Life Cider', '2', 'Another must try from Houssenberg', '50.00', 'Clear', '2015-01-13', 'In Stock');

-- 
-- Store procedure to find the latest Products
--

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `getProductDetail`()
BEGIN
	SELECT
    `product`.`p_id`,
    `product`.`name`,
    `product`.`description`,
    `brand`.`b_name`,
    `review`.`comment`,
    `review`.`user_id`
    FROM `product` inner join `brand` on `product`.`brand_ID` = `brand`.`b_id` inner join `review` on `review`.`product_id` = `product`.`p_id`
	ORDER BY `product`.`p_id`;
END$$
DELIMITER ;

-- 
-- Store procedure to create a review
--
DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `createReview`(IN userID Int(11), IN productID Int(11), IN rating INT(11), IN comments VARCHAR(250))
BEGIN
	DECLARE userIDNum INT DEFAULT 0;
    
	select `u_id`INTO userIDNum from `productdb`.`user`
    WHERE `u_id` = userID AND `type` = "customer";
    
    IF userIDNum IS NOT NULL THEN 
	INSERT INTO `productdb`.`review`
	(
	`rating`,`product_id`,`comment`,`user_id`)
	VALUES
	(rating,productID,comments,userID);

	END IF;
	
END$$
DELIMITER ;