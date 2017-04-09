nobelApp.service('informationService', function($q) {
	this.pageInformationSunburst = [
		{
			"paragraph": "On this page you will find a clickable sunburst with an interactive globe in its center. You can explore this by either clicking on the sunburst pieces, or select a country on the globe or in the roll down list to the right hand side of this page."
		}, {
			"paragraph": "The outer layer on the sunburst represents the laureates from a specific country. You can click on them to see more information. Should you only wish to see one category, use the categories at the right hand side of this page. You check the categories you want to see and uncheck the others. The laureates are color coded after which category they won that year."
		}, {
			"paragraph": "To see extra data, such as mean years in school or country BNI, chose one dataset to your right hand side on this page and the data will show on the globe (coloring the countries) for the years and countries where data is available."			
		}, {
			"paragraph": "To see how the extra data, or nobel laureates, have developed over the years, drag the time slider (starts with 1901 and ends with this year) as you wish. The data shown in the sunburst and globe will update so that the extra dataset will show the data for that specific year on the globe, and the sunburst will show all the laureates from 1901 to your selected year."
		}, {
			"paragraph": "If you wish to read more about the laureates, you can use the link to their wikipedia page."
		}
	];

	this.pageInformationChord = [
		{
			"paragraph": "This is a Chord Diagram showing the laureates of the nobel prize by gender and category. On the left side you see the categories, larger means more awards in this category. On the right side you see the genders and organizations, larger means more awards for this gender."
		}, {
			"paragraph": "Click on the rim to get more info on this category or gender. The sizes to left and right will now change representing the data you have selected. A random laureate will be presented on the right side of the screen."
		}, {
			"paragraph": "Click on the middle of the Chord Diagram to randomly generate another laureate."			
		}, {
			"paragraph": "Select Age data to view the winners by category and age when they won."
		}
	];


	this.getPageInformation = function(page){
		if (page === "sunburst") {
			return this.pageInformationSunburst;
		} else if (page === "chord") {
			return this.pageInformationChord;
		}
	}
});