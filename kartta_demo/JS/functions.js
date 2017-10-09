


$(document).ready(function() {	


	
	var yearsArr = kuntadata.map(function(obj) { return obj.vuosi; });
	yearsArr = yearsArr.filter(function(v,i) { return yearsArr.indexOf(v) == i; });

	//	yearsArr = [1997,1998,1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015]//[1987,1988,1989,1990,1991,1992];

	
	for (var i=0;i<yearsArr.length;i++) {
		
		$('#info').append("<div class='infoYear' style='display: none'>"+ yearsArr[i] + "</div>")
	
	}
	
	// hide all quotes except the first
	$('.infoYear').hide().eq(0).show();

	var pause = 2000;
	var motion = 500;

	var years = $('.infoYear');
	var count = years.length;
	var i = 0;
	
	cols = ['red','blue','green','orange'];
	
	
	
	function changeMapYear(year) {
		
		g = $('g');
		g.splice(0, 2);
		g.map(function(x) { 
			
			pno = $(this).attr('kuntakoodi');
			
			tmp = kuntadata.filter(function(x) { return(x['kuntakoodi']==pno) })
			
			tmp = tmp.filter(function(x) { return(x['vuosi'] == year)  });
			
			if (tmp.length>0) {
				$(this).css('fill',   tmp[0]['luokka']  ) 
			
			
				if (year==2015) {
					$(this).append('<div>'+tmp[0]['arvo']+'</div>');
					
					$(this).click(function() {
						alert('Kunta: '+$(this).attr('kuntakoodi')+', arvo: ' + $(this).children('div')[0].innerHTML );
					});
				}
			}
		});
		
	}
	
	changeMapYear(years[0]);
	

	
	
	
	$( ".infoYear" ).eq(0).show( "slow", function showNext() {
			
			$( this ).next( ".infoYear" ).delay(1).show( 'slow', showNext );
			$( this ).prev( ".infoYear" ).hide('fast');
			
			
			changeMapYear($(this)[0].innerHTML);
	});
	
	
	
});