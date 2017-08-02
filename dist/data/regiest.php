<?php
    header('Content-Type:application/json;charset=UTF-8');
    @$name = $_REQUEST['reg-name'] or die('{"msg":"reg-name required"}');
    @$pwd = $_REQUEST['reg-pwd'] or die('{"msg":"reg-pwd required"}');
    @$email = $_REQUEST['reg-email'] or die('{"msg":"reg-email required"}');
    @$phone = $_REQUEST['reg-phone'] or die('{"msg":"reg-phone required"}');
    require('kxmd_init.php');
    $sql = "INSERT INTO k_user VALUES(null,'$name','$pwd','$email','phone')";
    $result = mysqli_query($conn,$sql);
    if($result===false){
    //    echo '{"code":"2","msg":sql erro"' .$sql. '"}';
        $output["code"]=2;
        $output["msg"]="insert err";
        $output["sql"]=$sql;
    }else{
    //    echo '{"code":"1","msg":"succ"}';
        $output['code']=1;
        $output['userId']=mysqli_insert_id($conn);
    }
    echo json_encode($output);
?>