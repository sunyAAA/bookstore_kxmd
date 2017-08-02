<?php
   header('Content-Type:application/json;charset=UTF-8');
   require('kxmd_init.php');
   $output=[];
   $sql = "SELECT bid,img,name,price,title FROM k_books WHERE type=3 ORDER BY bid DESC LIMIT 8";
   $result = mysqli_query($conn,$sql);
   $type1 = mysqli_fetch_all($result,1);
   $output['wd']=$type1;
   $sql = "SELECT bid,img,name,price,title FROM k_books WHERE type=4 ORDER BY bid DESC LIMIT 8";
   $result = mysqli_query($conn,$sql);
   $type2 = mysqli_fetch_all($result,1);
   $output['art']=$type2;
   echo json_encode($output);
?>