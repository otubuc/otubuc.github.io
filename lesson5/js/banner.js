
<script language="Javascript">MyBanners=new Array('banner1.jpg','banner2.jpg','banner3.jpg','banner4.jpg')
MyBannerLinks=new Array('http://www.vbtutor.net/','http://www.excelvbatutor.com/','http://onlinebizguide4you.com/','http://javascript-tutor.net/')
banner=0
function ShowLinks(){
document.location.href="http://www."+MyBannerLinks[banner]
}function ShowBanners()
{ if (document.images)
{ banner++
if (banner==MyBanners.length) {
banner=0}
document.ChangeBanner.src=MyBanners[banner]
setTimeout("ShowBanners()",5000)
}
}
</script>

<body onload="ShowBanners()">
<center>
<a href="javascript: ShowLinks()">
<img src="banner1.jpg" width="900" height="120" name="ChangeBanner"/></a>
</center>
</body>
</html>
