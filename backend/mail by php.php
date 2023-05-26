<?php


if (isset($_POST['to']) && isset($_POST['sub']) && isset($_POST['msg'])) {        
    $to = $_POST['to'];
    $sub = $_POST['sub'];
    $msg = $_POST['msg'];
    $headers  = 'MIME-Version: 1.0' . "\r\n";
    $headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
    $headers .= 'To: '.$to."\r\n";
    if(!mail($to,$sub,$msg,$headers)){
        $myobj=array('status'=>'error','message'=>'Invalid e-mail!!');
        echo json_encode($myobj);
    } else {
        $myobj=array('status'=>'success');
    }
}else{
    header("Location: http://localhost/chat/Chat%20it/");
}

?>