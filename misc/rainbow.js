
h3 > a{
    /* -webkit-animation: rainbow 3s infinite;
  -ms-animation: rainbow 3s infinite;
  animation: rainbow 3s infinite; */
  font-size: 12px;

}

@-webkit-keyframes rainbow{
	20%{color: #a8bfe3;}
	40%{color: #C5EAD2;}
	60%{color: antiquewhite;}
	80%{color: aliceblue;}
	100%{color: darkseegreen;}
}
/* Internet Explorer */
@-ms-keyframes rainbow{
    20%{color: #a8bfe3;}
	40%{color: #eac5dd;}
	60%{color: #a8bfe3;}
	80%{color: #eac5dd;}
	100%{color: #a8bfe3;}
}

/* Standar Syntax */
@keyframes rainbow{
    20%{color: palevioletred;}
	40%{color: antiquewhite;}
	60%{color: #C5EAD2;}
	80%{color: #a8bfe3;}
	100%{color: plum;}
}
