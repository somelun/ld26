//image
var s_map = "Game/res/tiles.png";
var s_objects = "Game/res/objects.png";
var s_splash = "Game/res/splash.png";
var s_start_n = "Game/res/start_n.png";
var s_start_s = "Game/res/start_s.png";

//plist
var s_objects_plist = "Game/res/objects.plist";

//tmx
var s_map_plist = "Game/res/level.tmx";

//mp3
var s_song = "Game/res/song.mp3"

//effect
var s_jump = "Game/res/jump.mp3";
var s_expl = "Game/res/expl.mp3";
var s_shoot = "Game/res/shoot.mp3";

var g_ressources = [
	//image
	{type:"image", src:s_map},
	{type:"image", src:s_objects},
	{type:"image", src:s_start_n},
	{type:"image", src:s_start_s},

	//plist
	{type:"plist", src:s_objects_plist},

	//tmx
	{type:"tmx", src:s_map_plist},

	//mp3
	{type:"bgm", src:s_song},

	//effect
    {type:"effect",src:s_jump},
    {type:"effect",src:s_expl},
    {type:"effect",src:s_shoot},
];