-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- 主机： localhost
-- 生成日期： 2024-01-11 09:31:45
-- 服务器版本： 5.7.28
-- PHP 版本： 7.3.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 数据库： `library`
--

-- --------------------------------------------------------

--
-- 表的结构 `administrators`
--

CREATE TABLE `administrators` (
  `admin_id` int(11) NOT NULL,
  `username` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- 转存表中的数据 `administrators`
--

INSERT INTO `administrators` (`admin_id`, `username`, `password`) VALUES
(1, 'root', 'root');

-- --------------------------------------------------------

--
-- 表的结构 `books`
--

CREATE TABLE `books` (
  `book_id` int(11) NOT NULL,
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `author` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `publisher` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `isbn` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `category_id` int(11) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- 转存表中的数据 `books`
--

INSERT INTO `books` (`book_id`, `title`, `author`, `publisher`, `isbn`, `category_id`) VALUES
(1, '格林童话', '安徒生', '安徒生出版社', '1112221111', 1),
(2, '福尔摩斯探案', '华生', '福尔摩斯出版社', '2222222', 2);

-- --------------------------------------------------------

--
-- 表的结构 `book_categories`
--

CREATE TABLE `book_categories` (
  `category_id` int(11) NOT NULL,
  `category_name` varchar(255) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- 转存表中的数据 `book_categories`
--

INSERT INTO `book_categories` (`category_id`, `category_name`) VALUES
(1, '童话'),
(2, '探案'),
(3, '言情'),
(4, '悬疑'),
(5, '文学');

-- --------------------------------------------------------

--
-- 表的结构 `book_inventory`
--

CREATE TABLE `book_inventory` (
  `inventory_id` int(11) NOT NULL,
  `book_id` int(11) DEFAULT NULL,
  `quantity` int(11) NOT NULL COMMENT '总数',
  `lend` int(11) NOT NULL COMMENT '借出',
  `remaining` int(11) NOT NULL COMMENT '剩余'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- 转存表中的数据 `book_inventory`
--

INSERT INTO `book_inventory` (`inventory_id`, `book_id`, `quantity`, `lend`, `remaining`) VALUES
(1, 1, 2000, 0, 2000),
(2, 2, 4002, 2, 4000);

-- --------------------------------------------------------

--
-- 表的结构 `borrow_records`
--

CREATE TABLE `borrow_records` (
  `record_id` int(11) NOT NULL,
  `reader_id` int(11) DEFAULT NULL,
  `book_id` int(11) DEFAULT NULL,
  `borrow_date` date NOT NULL,
  `return_date` date NOT NULL,
  `status` enum('borrowed','returned','borrowedQ','returnedQ') COLLATE utf8_unicode_ci DEFAULT 'borrowedQ'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- 转存表中的数据 `borrow_records`
--

INSERT INTO `borrow_records` (`record_id`, `reader_id`, `book_id`, `borrow_date`, `return_date`, `status`) VALUES
(4, 1, 1, '2024-11-14', '2024-11-15', 'returned'),
(5, 1, 1, '2024-11-14', '2024-11-15', 'returned');

-- --------------------------------------------------------

--
-- 表的结构 `readers`
--

CREATE TABLE `readers` (
  `reader_id` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `id_card_number` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `contact_number` varchar(15) COLLATE utf8_unicode_ci NOT NULL,
  `status` enum('normal','frozen') COLLATE utf8_unicode_ci DEFAULT 'normal',
  `isDelete` enum('0','1') COLLATE utf8_unicode_ci DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- 转存表中的数据 `readers`
--

INSERT INTO `readers` (`reader_id`, `name`, `id_card_number`, `password`, `contact_number`, `status`, `isDelete`) VALUES
(1, '王八嘎', '111111', '111111', '17628144554', 'normal', '0');

--
-- 转储表的索引
--

--
-- 表的索引 `administrators`
--
ALTER TABLE `administrators`
  ADD PRIMARY KEY (`admin_id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- 表的索引 `books`
--
ALTER TABLE `books`
  ADD PRIMARY KEY (`book_id`),
  ADD KEY `category_id` (`category_id`);

--
-- 表的索引 `book_categories`
--
ALTER TABLE `book_categories`
  ADD PRIMARY KEY (`category_id`);

--
-- 表的索引 `book_inventory`
--
ALTER TABLE `book_inventory`
  ADD PRIMARY KEY (`inventory_id`),
  ADD KEY `book_id` (`book_id`);

--
-- 表的索引 `borrow_records`
--
ALTER TABLE `borrow_records`
  ADD PRIMARY KEY (`record_id`),
  ADD KEY `reader_id` (`reader_id`),
  ADD KEY `book_id` (`book_id`);

--
-- 表的索引 `readers`
--
ALTER TABLE `readers`
  ADD PRIMARY KEY (`reader_id`) USING BTREE,
  ADD UNIQUE KEY `id_card_number` (`id_card_number`);

--
-- 在导出的表使用AUTO_INCREMENT
--

--
-- 使用表AUTO_INCREMENT `administrators`
--
ALTER TABLE `administrators`
  MODIFY `admin_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- 使用表AUTO_INCREMENT `books`
--
ALTER TABLE `books`
  MODIFY `book_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- 使用表AUTO_INCREMENT `book_categories`
--
ALTER TABLE `book_categories`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- 使用表AUTO_INCREMENT `book_inventory`
--
ALTER TABLE `book_inventory`
  MODIFY `inventory_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- 使用表AUTO_INCREMENT `borrow_records`
--
ALTER TABLE `borrow_records`
  MODIFY `record_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- 使用表AUTO_INCREMENT `readers`
--
ALTER TABLE `readers`
  MODIFY `reader_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
