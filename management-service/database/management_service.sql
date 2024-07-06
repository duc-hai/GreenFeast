-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th5 29, 2024 lúc 04:40 PM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `management_service`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `area`
--

CREATE TABLE `area` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `isDeleted` tinyint(4) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `area`
--

INSERT INTO `area` (`id`, `name`, `description`, `created_at`, `updated_at`, `deleted_at`, `isDeleted`) VALUES
(1, 'Tầng 1', 'Khu vực tầng trệt', '2024-03-09 13:04:36', NULL, NULL, 0),
(2, 'Tầng 2', 'Khu vực tầng 2', '2024-03-09 13:04:57', NULL, NULL, 0),
(3, 'Mua mang về', 'Dành cho khách mua mang về', '2024-03-09 13:05:35', NULL, NULL, 0),
(4, 'Grab', 'Dành cho đơn Grab, giá cao hơn 15% so với mua tại quán', '2024-03-09 13:06:27', NULL, NULL, 0),
(5, 'Shopee', 'Dành cho đơn Shopee Food, giá cao hơn 15% so với mua tại quán', '2024-03-09 13:07:00', NULL, NULL, 0),
(6, 'Nhân viên', 'Đơn nhân viên, giảm 10%', '2024-03-09 13:07:30', NULL, NULL, 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `category`
--

CREATE TABLE `category` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `isDeleted` tinyint(4) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `category`
--

INSERT INTO `category` (`id`, `name`, `created_at`, `updated_at`, `deleted_at`, `isDeleted`) VALUES
(1, 'Khai vị', '2024-03-09 01:35:23', NULL, NULL, 0),
(2, 'Món ngũ cốc', '2024-03-09 01:35:31', NULL, NULL, 0),
(3, 'Món xào', '2024-03-09 01:35:50', NULL, NULL, 0),
(4, 'Món xào', '2024-03-09 01:35:55', '2024-05-29 15:27:09', '2024-05-29 15:27:14', 0),
(5, 'Món canh', '2024-03-09 01:36:16', NULL, NULL, 0),
(6, 'Lẩu', '2024-03-09 01:36:40', NULL, NULL, 0),
(7, 'Món trộn', '2024-03-09 01:37:01', NULL, NULL, 0),
(8, 'Món thêm', '2024-03-09 01:37:17', NULL, NULL, 0),
(9, 'Nước trái cây', '2024-03-09 01:39:45', NULL, NULL, 0),
(10, 'Nước ngọt', '2024-03-09 01:39:53', NULL, NULL, 0),
(11, 'Sữa', '2024-03-09 01:40:04', NULL, NULL, 0),
(12, 'Trà', '2024-03-09 01:40:12', NULL, NULL, 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `menu`
--

CREATE TABLE `menu` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `price` int(11) NOT NULL,
  `menu_type` int(11) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 1,
  `category_id` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `isDeleted` tinyint(4) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `menu`
--

INSERT INTO `menu` (`id`, `name`, `description`, `image`, `price`, `menu_type`, `status`, `category_id`, `created_at`, `updated_at`, `deleted_at`, `isDeleted`) VALUES
(1, 'Gỏi cuốn sốt đậu phộng', 'Với các nguyên liệu thanh đạm, và đặc biệt là nước chấm “xốt đậu phộng” béo béo, bùi bùi làm món Gỏi Cuốn Chay thêm ngon, ăn hoài không chán đó nha!', 'https://res.cloudinary.com/dmjsmmt3h/image/upload/v1709926819/wpu3gkpkqqpn4zgbbczs.jpg', 90000, 1, 0, 1, '2024-03-09 02:40:19', '2024-03-19 23:46:29', NULL, 0),
(2, 'Chả giò', 'Chả giò là món ăn cực kỳ phổ biến tại Việt Nam. Một cuốn chả giò thơm sẽ là sự kết hợp giữa phần nhân tròn vị và phần bánh tráng giòn tan', 'https://res.cloudinary.com/dmjsmmt3h/image/upload/v1709927150/fm6hiqag2rcfhmyvu6o5.jpg', 80000, 1, 1, 1, '2024-03-09 02:45:51', NULL, NULL, 0),
(3, 'Đậu hũ chiên giòn', 'Đậu hũ chiên là món quen thuộc trong bữa cơm gia đình đặc biệt nó còn là món yêu thích của các bạn thích bún đậu mắm tôm', 'https://res.cloudinary.com/dmjsmmt3h/image/upload/v1709927368/m0qko4lo64gfcikvlcud.png', 30000, 1, 0, 1, '2024-03-09 02:49:28', '2024-03-21 19:11:32', NULL, 0),
(4, 'Bông cải xào tỏi', 'Bông cải xanh xào tỏi là món đơn giản từ bông cải xanh, bông cải xanh xào vừa chín tới cùng với vị thơm từ tỏi hòa cùng với nhau rất bắt vị', 'https://res.cloudinary.com/dmjsmmt3h/image/upload/v1709927628/psciktiykhjoibcastbf.jpg', 70000, 1, 1, 1, '2024-03-09 02:53:49', NULL, NULL, 0),
(5, 'Khoai tây chiên bơ', 'Khoai tây chiên bơ là một món ăn vặt hấp dẫn với vẻ ngoài vàng rượm, lại vừa giòn vừa thơm kết hợp cùng vị cay cay của tương ớt tạo nên một hương vị ngon khó cưỡng. Ngoài là món ăn ngon thì khoai tây còn có nhiều lợi ích với sức khoẻ', 'https://res.cloudinary.com/dmjsmmt3h/image/upload/v1709927804/oh1rvtrxuci4ishj44j8.jpg', 45000, 1, 1, 1, '2024-03-09 02:56:44', NULL, NULL, 0),
(6, 'Cơm chiên thượng hải', 'Cơm chiên Thượng Hải thường được làm từ cơm trắng đã nấu chín và cắt nhỏ, sau đó được xào chung với các nguyên liệu như thịt heo, tôm, trứng, rau cải, hành tây và gia vị như dầu mè, dầu mè trắng, dầu mỡ hành, nước tương, và gia vị khác', 'https://res.cloudinary.com/dmjsmmt3h/image/upload/v1709928190/b4rwmymiig6kska3xo2h.jpg', 75000, 1, 1, 2, '2024-03-09 03:03:11', NULL, NULL, 0),
(7, 'Bún chả giò', 'Khi thưởng thức bún chả giò, người ta thường đặt bún vào tô, thêm chả giò chiên giòn lên trên, và kèm theo rau sống như rau sống, rau mầm, và các loại rau xanh khác. Bún chả giò thường được ăn kèm với nước mắm pha chua ngọt và có thể được thêm chút giấm, ', 'https://res.cloudinary.com/dmjsmmt3h/image/upload/v1709928402/fh6m9ejxkfppnryqlq79.jpg', 65000, 1, 1, 2, '2024-03-09 03:06:43', NULL, NULL, 0),
(8, 'Bánh ướt', 'Bánh ướt là một món ăn truyền thống của ẩm thực Việt Nam, được làm từ gạo và thường được ăn vào bữa sáng hoặc buổi tối. \"Bánh ướt\" có nguồn gốc từ cách nấu gạo thành một loại bánh mỏng và mềm mịn, được phủ bằng một lớp giấy dễ gập và cắt thành từng miếng ', 'https://res.cloudinary.com/dmjsmmt3h/image/upload/v1709928475/zizp2iyykp7voglkd7hf.jpg', 50000, 1, 1, 2, '2024-03-09 03:07:55', NULL, NULL, 0),
(9, 'Mì xào thập cẩm', 'Cách làm mì xào thập cẩm thường bắt đầu bằng việc chiên các loại thập cẩm trong dầu nóng cho đến khi chín và thơm. Sau đó, mì được thêm vào và xào chung với các nguyên liệu khác. Một số thực khách có thể thích thêm sốt để gia vị hoặc ẩm thực cụ thể', 'https://res.cloudinary.com/dmjsmmt3h/image/upload/v1709928672/j3ge9eigsfzgzcrsupe7.png', 47000, 1, 1, 2, '2024-03-09 03:11:12', NULL, NULL, 0),
(10, 'Ngó sen xào nấm', 'Ngó sen xào nấm là món chay xào với hai nguyên liệu chính là nấm và ngó sen, điểm thêm chút màu sắc của cà rốt để hấp dẫn hơn', 'https://res.cloudinary.com/dmjsmmt3h/image/upload/v1709961190/k74lre3ekvcrxner1vaz.jpg', 55000, 1, 1, 3, '2024-03-09 12:13:11', NULL, NULL, 0),
(11, 'Vịt chay xào', 'Vịt chay xào lăn và xào gừng với hương vị đậm đà, thơm ngon, hấp dẫn chắc chắn sẽ sẽ khiến cho những bữa ăn chay của gia đình bạn thêm phần ấm áp', 'https://res.cloudinary.com/dmjsmmt3h/image/upload/v1709961331/psgmvtlnaqkptzax6pgp.jpg', 85000, 1, 1, 3, '2024-03-09 12:15:32', NULL, NULL, 0),
(12, 'Nấm xào chay', 'Nấm xào chay rất thơm, việc kết hợp xào nấm cùng với các loại rau củ quả khác giúp cho món xào này hấp dẫn về cả hương vị và màu sắc, hình thức', 'https://res.cloudinary.com/dmjsmmt3h/image/upload/v1709961437/piqdozqd4rzz1s5ma979.jpg', 70000, 1, 1, 3, '2024-03-09 12:17:18', NULL, NULL, 0),
(13, 'Rong biển xào xả', 'Rong biển xào xả là một món ăn phổ biến trong ẩm thực Việt Nam, kết hợp giữa rong biển và mùi thơm của lá xả tạo nên một hương vị độc đáo và hấp dẫn. Đây cũng là một món ăn chay phổ biến và giàu dinh dưỡng', 'https://res.cloudinary.com/dmjsmmt3h/image/upload/v1709961573/it8zw5dzm1hbw0ocfyh6.jpg', 53000, 1, 1, 3, '2024-03-09 12:19:33', NULL, NULL, 0),
(14, 'Đậu hũ kho nấm rơm', 'Đậu hũ kho nấm rơm là một món ăn chay phổ biến trong ẩm thực Việt Nam, kết hợp giữa đậu hũ mềm mại và hương vị thơm ngon của nấm rơm', 'https://res.cloudinary.com/dmjsmmt3h/image/upload/v1709961717/yzojgky2yeckykuxfhmc.jpg', 45000, 1, 1, 4, '2024-03-09 12:21:57', NULL, NULL, 0),
(15, 'Chân nấm kho gừng', 'Chân nấm kho gừng là một món ăn truyền thống trong ẩm thực Việt Nam, mang hương vị đặc trưng của nấm cùng với hương thơm và vị độc đáo của gừng', 'https://res.cloudinary.com/dmjsmmt3h/image/upload/v1709961836/wgkbafdqjfavdw5qolqf.jpg', 57000, 1, 1, 4, '2024-03-09 12:23:56', NULL, NULL, 0),
(16, 'Chả lụa kho tiêu', 'Chả lụa kho tiêu là một món ăn truyền thống trong ẩm thực Việt Nam, kết hợp giữa vị thơm của chả lụa và hương vị đặc trưng của tiêu. Đây là một món ăn đơn giản nhưng ngon miệng và phổ biến trong các bữa ăn gia đình', 'https://res.cloudinary.com/dmjsmmt3h/image/upload/v1709961929/l9dqtk5kg87mdzxj6ywz.jpg', 92000, 1, 1, 4, '2024-03-09 12:25:30', NULL, NULL, 0),
(17, 'Sườn non chay rim chua ngọt', 'Sườn non chay rim chua ngọt là một món ăn chay phổ biến trong ẩm thực Việt Nam, mang hương vị đặc trưng của sườn non và sự kết hợp giữa vị chua của giấm và vị ngọt của đường. Đây là một món ăn chay thơm ngon và hấp dẫn, thích hợp cho cả người ăn chay và n', 'https://res.cloudinary.com/dmjsmmt3h/image/upload/v1709962019/yszgzneidh5tcazfkj1z.jpg', 110000, 1, 1, 4, '2024-03-09 12:27:00', NULL, NULL, 0),
(18, 'Tôm kho tàu', 'Tôm kho tàu chay là một món ăn chay phổ biến trong ẩm thực Việt Nam, mang hương vị đặc trưng của tôm kết hợp với sự ngọt tự nhiên của nước dừa và hương vị độc đáo của các gia vị. Đây là một món ăn thơm ngon, giàu dinh dưỡng và thích hợp cho cả những người', 'https://res.cloudinary.com/dmjsmmt3h/image/upload/v1709962129/xmfldqpngkx75gjnl1xr.jpg', 120000, 1, 1, 4, '2024-03-09 12:28:50', NULL, NULL, 0),
(19, 'Canh bông hẹ đậu hũ', 'Canh bông hẹ đậu hũ là một món canh truyền thống trong ẩm thực Việt Nam, kết hợp giữa hương vị tươi mát của bông hẹ, sự thơm ngon của đậu hũ và hương vị đậm đà của nước dùng. Đây là một món canh nhẹ nhàng, bổ dưỡng và rất phổ biến trong các bữa ăn gia đìn', 'https://res.cloudinary.com/dmjsmmt3h/image/upload/v1709962237/vrmmalmsygvoiqc8elol.jpg', 37000, 1, 1, 5, '2024-03-09 12:30:38', NULL, NULL, 0),
(20, 'Canh cải chua tứ xuyên', 'Canh cải chua tứ xuyên là một món canh truyền thống đặc trưng của vùng miền Tứ Xuyên ở Trung Quốc. Món này thường được biết đến với hương vị chua chua, cay cay, ngọt ngọt, và có sự hòa quện giữa cải chua và các loại gia vị đặc trưng', 'https://res.cloudinary.com/dmjsmmt3h/image/upload/v1709962322/znsrm9jkpore10svnxre.jpg', 46000, 1, 1, 5, '2024-03-09 12:32:03', NULL, NULL, 0),
(21, 'Canh khổ qua', 'Canh khổ qua không chỉ là một món ăn bổ dưỡng mà còn là biểu tượng của ẩm thực dân dã, gần gũi và đậm đà của người Việt Nam. Hương vị đặc trưng của món canh này không chỉ thu hút khẩu vị mà còn mang đến cảm giác ấm áp và quen thuộc đối với người thưởng th', 'https://res.cloudinary.com/dmjsmmt3h/image/upload/v1709962427/rrerp46z1ovzzvhezqct.jpg', 52000, 1, 1, 5, '2024-03-09 12:33:48', NULL, NULL, 0),
(22, 'Lẩu nấm thập cẩm', 'Lẩu nấm thập cẩm là một món ăn phổ biến trong ẩm thực Á Đông, đặc biệt là ở các nước như Trung Quốc, Nhật Bản và Hàn Quốc. Món này thường được chế biến từ các loại nấm khác nhau cùng các loại rau củ và thực phẩm khác, tạo nên một tô lẩu đậm đà, thơm ngon ', 'https://res.cloudinary.com/dmjsmmt3h/image/upload/v1709962555/hchwmka93aum1o60ggur.png', 157000, 1, 1, 6, '2024-03-09 12:35:55', NULL, NULL, 0),
(23, 'Lẩu nhiệt đới', 'Lẩu nhiệt đới là một món ăn phổ biến và thú vị, thường được tìm thấy trong các nhà hàng và buổi tiệc ở các khu vực có khí hậu nhiệt đới. Món này thường kết hợp nhiều loại thực phẩm và gia vị từ các vùng đất nhiệt đới, tạo ra một hương vị đa dạng, phong ph', 'https://res.cloudinary.com/dmjsmmt3h/image/upload/v1709962648/b1tyf3rqjg9wan9fyuyg.jpg', 180000, 1, 1, 6, '2024-03-09 12:37:28', NULL, NULL, 0),
(24, 'Gỏi xoài khô mặn', 'Gỏi xoài khô mặn là một món ăn truyền thống ở nhiều vùng miền Việt Nam. Món này kết hợp giữa hương vị chua, mặn, ngọt, cay của các nguyên liệu như xoài khô, tôm khô, thịt khô và gia vị, tạo nên một hương vị đặc trưng và hấp dẫn', 'https://res.cloudinary.com/dmjsmmt3h/image/upload/v1709962728/a43ty7ndvoakhk4o1jbo.jpg', 57000, 1, 1, 7, '2024-03-09 12:38:49', NULL, NULL, 0),
(25, 'Gỏi chôm chôm chua ngọt', 'Món gỏi chôm chôm chua ngọt thường là một lựa chọn bổ dưỡng và thú vị trong các bữa ăn gia đình và buổi gặp gỡ bạn bè. Hương vị chua ngọt, mát lạnh của gỏi chôm chôm sẽ chinh phục được cả những thực khách khó tính nhất', 'https://res.cloudinary.com/dmjsmmt3h/image/upload/v1709962860/sjtoh7b19wttgbntktjy.jpg', 82000, 1, 1, 7, '2024-03-09 12:41:01', NULL, NULL, 0),
(26, 'Xà lách trộn', 'Xà lách trộn là một món salad phổ biến và rất được ưa chuộng trên toàn thế giới. Món salad này thường được làm từ xà lách và các nguyên liệu khác như rau củ, hoa quả, hạt, và sốt, tạo ra một hương vị độc đáo và bổ dưỡng', 'https://res.cloudinary.com/dmjsmmt3h/image/upload/v1709963002/clgd9gkd0quhgdajtwtl.png', 45000, 1, 1, 7, '2024-03-09 12:43:23', NULL, NULL, 0),
(27, 'Cơm thêm', 'Cơm thêm', 'https://res.cloudinary.com/dmjsmmt3h/image/upload/v1709963082/xcq5ccsprwtz9osmlwsv.jpg', 10000, 1, 1, 8, '2024-03-09 12:44:42', NULL, NULL, 0),
(28, 'Bún thêm', 'Bún thêm', 'https://res.cloudinary.com/dmjsmmt3h/image/upload/v1709963152/zxudxy9sk0ko1ss555sm.jpg', 10000, 1, 1, 8, '2024-03-09 12:45:53', '2024-03-11 00:12:15', NULL, 0),
(29, 'Rau thêm', 'Rau thêm', 'https://res.cloudinary.com/dmjsmmt3h/image/upload/v1709963196/ujncxuowx7zfswwdqq8e.jpg', 10000, 1, 1, 8, '2024-03-09 12:46:36', '2024-03-09 12:48:07', NULL, 0),
(30, 'Cam cà rốt', 'Nước ép cam cà rốt là một đồ uống bổ dưỡng và ngon miệng, kết hợp hài hòa giữa vị ngọt tự nhiên của cà rốt và vị chua ngọt của cam', 'https://res.cloudinary.com/dmjsmmt3h/image/upload/v1709963424/clhmpc13wom1tyidg7am.png', 40000, 2, 1, 9, '2024-03-09 12:50:25', NULL, NULL, 0),
(31, 'Dừa tươi', 'Dừa tươi là một loại trái cây tự nhiên và bổ dưỡng, thường được ưa chuộng để thưởng thức trực tiếp hoặc sử dụng trong nhiều món ăn và đồ uống khác nhau', 'https://res.cloudinary.com/dmjsmmt3h/image/upload/v1709963513/aeifug0uygg16u1t5yis.jpg', 35000, 2, 1, 9, '2024-03-09 12:51:54', NULL, NULL, 0),
(32, 'Nha đam hạt chia', 'Nha đam hạt chia là một lựa chọn đồ uống và thực phẩm bổ dưỡng, giàu chất xơ và omega-3, giúp cung cấp năng lượng và duy trì sức khỏe tốt cho cơ thể. Đồ uống này thường được thưởng thức vào bất kỳ thời gian nào trong ngày và là một phần của chế độ ăn uống', 'https://res.cloudinary.com/dmjsmmt3h/image/upload/v1709963579/ydpbeervkbvmacmm31km.jpg', 45000, 2, 1, 9, '2024-03-09 12:52:59', NULL, NULL, 0),
(33, 'Coca', 'Coca Zero Sugar', 'https://res.cloudinary.com/dmjsmmt3h/image/upload/v1709963677/mbwgkpouaw2frpsbmwb1.jpg', 15000, 2, 1, 10, '2024-03-09 12:54:38', NULL, NULL, 0),
(34, '7up', 'Free chất xơ', 'https://res.cloudinary.com/dmjsmmt3h/image/upload/v1709963734/zvvhxmzwndcakfh0j5uv.png', 15000, 2, 1, 10, '2024-03-09 12:55:35', NULL, NULL, 0),
(35, 'Sting', 'Sting', 'https://res.cloudinary.com/dmjsmmt3h/image/upload/v1709963793/mo5beibajun9pgddnpq2.jpg', 15000, 2, 1, 10, '2024-03-09 12:56:33', NULL, NULL, 0),
(36, 'Sữa chua trái cây', 'Sữa chua trái cây là một món ăn nhẹ và bổ dưỡng được làm từ sự kết hợp giữa sữa chua và các loại trái cây tươi', 'https://res.cloudinary.com/dmjsmmt3h/image/upload/v1709963879/j7qobjwhoc96mifts0cy.png', 35000, 2, 1, 11, '2024-03-09 12:58:00', NULL, NULL, 0),
(37, 'Sữa đậu nành', 'Sữa đậu nành là một thay thế sức khỏe cho sữa từ sữa bò, đặc biệt phù hợp cho những người ăn chay, người không dung nạp được lactose, và những ai quan tâm đến sức khỏe của mình', 'https://res.cloudinary.com/dmjsmmt3h/image/upload/v1709963942/jtyne1dvwd7nhnclw2d3.jpg', 30000, 2, 1, 11, '2024-03-09 12:59:02', NULL, NULL, 0),
(38, 'Trà trái cây nhiệt đới', 'Trà trái cây nhiệt đới là một đồ uống phổ biến được pha chế từ trà đen hoặc trà xanh kết hợp với hương vị tự nhiên và tươi mát của các loại trái cây nhiệt đới', 'https://res.cloudinary.com/dmjsmmt3h/image/upload/v1709964064/gdfxyupsjsugb31y8hs9.jpg', 43000, 2, 1, 12, '2024-03-09 13:01:04', NULL, NULL, 0),
(39, 'Trà chanh thái đỏ', 'Trà chanh thái đỏ là một biến thể độc đáo của trà chanh truyền thống, nổi tiếng với màu sắc và hương vị tươi mát, cũng như lợi ích sức khỏe từ thành phần chính là trà và chanh', 'https://res.cloudinary.com/dmjsmmt3h/image/upload/v1709964138/gpsh1htiuiodqklmixga.jpg', 39000, 2, 1, 12, '2024-03-09 13:02:18', NULL, NULL, 0),
(40, 'Trà vải cam sả', 'Trà vải cam sả là một loại đồ uống truyền thống của nhiều vùng miền, nổi tiếng với hương vị tươi mát và sự kết hợp độc đáo giữa vải, cam và sả', 'https://res.cloudinary.com/dmjsmmt3h/image/upload/v1709964231/lvwxg4lozvpwzdw6zwho.png', 40000, 2, 1, 12, '2024-03-09 13:03:52', NULL, '2024-05-29 10:53:50', 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `printer`
--

CREATE TABLE `printer` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `ip_address` varchar(255) NOT NULL,
  `printer_type` int(11) NOT NULL,
  `area_id` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `isDeleted` tinyint(4) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `printer`
--

INSERT INTO `printer` (`id`, `name`, `ip_address`, `printer_type`, `area_id`, `created_at`, `updated_at`, `deleted_at`, `isDeleted`) VALUES
(1, 'Máy in tầng 1', '192.168.0.1', 1, 1, '2024-03-10 15:28:27', NULL, '0000-00-00 00:00:00', 0),
(2, 'Máy in tầng 1', '192.168.0.1', 1, 3, '2024-03-10 15:28:34', NULL, NULL, 0),
(3, 'Máy in tầng 1', '192.168.0.1', 1, 4, '2024-03-10 15:28:39', NULL, NULL, 0),
(4, 'Máy in tầng 1', '192.168.0.1', 1, 5, '2024-03-10 15:28:42', NULL, NULL, 0),
(5, 'Máy in tầng 1', '192.168.0.1', 1, 6, '2024-03-10 15:28:46', NULL, NULL, 0),
(6, 'Máy in tầng 2', '192.168.0.1', 1, 2, '2024-03-10 15:29:21', NULL, NULL, 0),
(7, 'Máy in bếp', '192.168.0.2', 2, 0, '2024-03-10 15:29:46', '2024-05-29 15:30:52', NULL, 0),
(8, 'Máy in quầy nước', '192.168.0.3', 3, 0, '2024-03-10 15:30:14', NULL, NULL, 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `promotion`
--

CREATE TABLE `promotion` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 1,
  `note` varchar(255) NOT NULL DEFAULT '1',
  `form_promotion` int(11) NOT NULL,
  `condition_apply` int(11) DEFAULT NULL,
  `promotion_value` varchar(255) NOT NULL,
  `auto_apply` tinyint(4) NOT NULL DEFAULT 1,
  `start_at` datetime DEFAULT NULL,
  `end_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `isDeleted` tinyint(4) NOT NULL DEFAULT 0,
  `description` varchar(255) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `promotion`
--

INSERT INTO `promotion` (`id`, `name`, `status`, `note`, `form_promotion`, `condition_apply`, `promotion_value`, `auto_apply`, `start_at`, `end_at`, `created_at`, `updated_at`, `deleted_at`, `isDeleted`, `description`) VALUES
(1, 'Khuyến mãi ngày tết nè he he', 0, 'Ghi chú khuyến mãi', 2, 41, '-50000', 1, NULL, NULL, '2024-03-14 22:39:18', '2024-05-29 15:34:12', NULL, 0, ''),
(2, 'Khuyến mãi đầu xuân', 1, 'Giảm 10% cho món chả giò, đặc sản ngày tết', 2, 2, '-10%', 1, NULL, NULL, '2024-05-29 15:33:52', NULL, NULL, 0, 'mô tả');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `table`
--

CREATE TABLE `table` (
  `id` varchar(255) NOT NULL,
  `area_id` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `isDeleted` tinyint(4) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `table`
--

INSERT INTO `table` (`id`, `area_id`, `created_at`, `updated_at`, `deleted_at`, `isDeleted`) VALUES
('A01', 1, '2024-03-13 19:16:48', NULL, NULL, 0),
('A02', 1, '2024-03-13 19:16:48', NULL, NULL, 0),
('A03', 1, '2024-03-13 19:16:48', NULL, NULL, 0),
('A04', 1, '2024-03-13 19:16:48', NULL, NULL, 0),
('A05', 1, '2024-03-13 19:16:48', NULL, NULL, 0),
('A06', 1, '2024-03-13 19:16:48', NULL, NULL, 0),
('A07', 1, '2024-03-13 19:16:48', NULL, NULL, 0),
('A08', 1, '2024-03-13 19:16:48', NULL, NULL, 0),
('A09', 1, '2024-03-13 19:16:48', NULL, NULL, 0),
('A10', 1, '2024-03-13 19:16:48', NULL, NULL, 0),
('A11', 1, '2024-03-13 19:16:48', NULL, NULL, 0),
('A12', 1, '2024-03-13 19:16:48', NULL, NULL, 0),
('A13', 1, '2024-03-13 19:16:48', NULL, NULL, 0),
('A14', 1, '2024-03-13 19:16:48', NULL, NULL, 0),
('A15', 1, '2024-03-13 19:16:48', NULL, NULL, 0),
('A16', 1, '2024-03-13 19:16:48', NULL, NULL, 0),
('A17', 1, '2024-03-13 19:16:48', NULL, NULL, 0),
('A18', 1, '2024-03-13 19:16:48', NULL, NULL, 0),
('A19', 1, '2024-03-13 19:16:48', NULL, NULL, 0),
('A20', 1, '2024-03-13 19:16:48', NULL, NULL, 0),
('B01', 2, '2024-03-13 19:17:34', NULL, NULL, 0),
('B02', 2, '2024-03-13 19:17:34', NULL, NULL, 0),
('B03', 2, '2024-03-13 19:17:34', NULL, NULL, 0),
('B04', 2, '2024-03-13 19:17:34', NULL, NULL, 0),
('B05', 2, '2024-03-13 19:17:34', NULL, NULL, 0),
('B06', 2, '2024-03-13 19:17:34', NULL, NULL, 0),
('B07', 2, '2024-03-13 19:17:34', NULL, NULL, 0),
('B08', 2, '2024-03-13 19:17:34', NULL, NULL, 0),
('B09', 2, '2024-03-13 19:17:34', NULL, NULL, 0),
('B10', 2, '2024-03-13 19:17:34', NULL, NULL, 0),
('B11', 2, '2024-03-13 19:17:34', NULL, NULL, 0),
('B12', 2, '2024-03-13 19:17:34', NULL, NULL, 0),
('B13', 2, '2024-03-13 19:17:34', NULL, NULL, 0),
('B14', 2, '2024-03-13 19:17:34', NULL, NULL, 0),
('B15', 2, '2024-03-13 19:17:34', NULL, NULL, 0),
('GRAB01', 4, '2024-03-13 19:18:30', NULL, NULL, 0),
('GRAB02', 4, '2024-03-13 19:18:30', NULL, NULL, 0),
('GRAB03', 4, '2024-03-13 19:18:30', NULL, NULL, 0),
('GRAB04', 4, '2024-03-13 19:18:30', NULL, NULL, 0),
('GRAB05', 4, '2024-03-13 19:18:30', NULL, NULL, 0),
('GRAB06', 4, '2024-03-13 19:18:30', NULL, NULL, 0),
('GRAB07', 4, '2024-03-13 19:18:30', NULL, NULL, 0),
('GRAB08', 4, '2024-03-13 19:18:30', NULL, NULL, 0),
('GRAB09', 4, '2024-03-13 19:18:30', NULL, NULL, 0),
('GRAB10', 4, '2024-03-13 19:18:30', NULL, NULL, 0),
('MMV01', 3, '2024-03-13 19:17:54', NULL, NULL, 0),
('MMV02', 3, '2024-03-13 19:17:54', NULL, NULL, 0),
('MMV03', 3, '2024-03-13 19:17:54', NULL, NULL, 0),
('MMV04', 3, '2024-03-13 19:17:54', NULL, NULL, 0),
('MMV05', 3, '2024-03-13 19:17:54', NULL, NULL, 0),
('MMV06', 3, '2024-03-13 19:17:54', NULL, NULL, 0),
('MMV07', 3, '2024-03-13 19:17:54', NULL, NULL, 0),
('MMV08', 3, '2024-03-13 19:17:54', NULL, NULL, 0),
('MMV09', 3, '2024-03-13 19:17:54', NULL, NULL, 0),
('MMV10', 3, '2024-03-13 19:17:54', NULL, NULL, 0),
('SHOPEE01', 5, '2024-03-13 19:18:45', NULL, NULL, 0),
('SHOPEE02', 5, '2024-03-13 19:18:45', NULL, NULL, 0),
('SHOPEE03', 5, '2024-03-13 19:18:45', NULL, NULL, 0),
('SHOPEE04', 5, '2024-03-13 19:18:45', NULL, NULL, 0),
('SHOPEE05', 5, '2024-03-13 19:18:45', NULL, NULL, 0),
('SHOPEE06', 5, '2024-03-13 19:18:45', NULL, NULL, 0),
('SHOPEE07', 5, '2024-03-13 19:18:45', NULL, NULL, 0),
('SHOPEE08', 5, '2024-03-13 19:18:45', NULL, NULL, 0),
('SHOPEE09', 5, '2024-03-13 19:18:45', NULL, NULL, 0),
('SHOPEE10', 5, '2024-03-13 19:18:45', NULL, NULL, 0);

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `area`
--
ALTER TABLE `area`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `menu`
--
ALTER TABLE `menu`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `printer`
--
ALTER TABLE `printer`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `promotion`
--
ALTER TABLE `promotion`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `table`
--
ALTER TABLE `table`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `area`
--
ALTER TABLE `area`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT cho bảng `category`
--
ALTER TABLE `category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT cho bảng `menu`
--
ALTER TABLE `menu`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT cho bảng `printer`
--
ALTER TABLE `printer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT cho bảng `promotion`
--
ALTER TABLE `promotion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
