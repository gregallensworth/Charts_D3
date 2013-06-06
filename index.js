var QUALITATIVE_COLORS = [
    '#8DD3C7',
    '#FFFFB3',
    '#BEBADA',
    '#FB8072',
    '#80B1D3',
    '#FDB462',
    '#B3DE69',
    '#FCCDE5',
    '#D9D9D9',
    '#BC80BD',
    '#CCEBC5',
    '#FFED6F',
];

var SINGLE_BAR_COLOR = '#006D2C';


// data for a pie chart
// associative array of labels onto counts
var PIE_DATA = {
    "18 - 24":708,
    "25 - 34":1111,
    "35 - 44":983,
    "45 - 54":836,
    "55 - 64":808,
    "65 +":982
};

// data for a bar chart
// associative array of labels onto counts
var BAR_DATA = {
    "1 month":3174,
    "1-6 months":637,
    "6-12 months":239,
    "1-2 years":93,
    "2-3 years":55,
    "3-4 years":32,
    "4-5 years":23,
    "5+ years":129,
    "Never":24
}

// data for a word cloud
// associative array of words onto counts
var WORDCLOUD_DATA = {
    "the":333,"and":228,"I":128,"to":115,"a":104,"on":91,"with":81,"in":71,"at":62,"play":50,"park":39,"my":38,"of":38,"beach":31,"-":31,"water":30,"We":30,"for":29,"go":28,"like":26,"kids":25,"playground":25,"walking":24,"playing":23,"or":23,"riding":23,"do":23,"out":22,"around":21,"dog":20,"also":20,"we":19,"take":17,"use":17,"just":16,"have":16,"nature":16,"seeing":16,".":15,"children":15,"that":15,"boat":14,"area":14,"people":14,"Water":14,"Boat":14,"watch":14,"beach.":13,"Playing":13,"used":13,"watching":13,"fishing":13,"was":13,"walk":13,"The":13,"site":13,"exercise":13,"\"I":12,"Horseback":12,"there":12,"TA":12,"Playground":12,"back":11,"lot":11,"riding.":11,"Play":11,"golf":11,"park.":11,"an":11,"fountain.":11,"bike":10,"they":10,"Parking":10,"hiking":10,"Playground.":10
}


function init () {

        // pie chart example
        // Add up the counts from individual slicesa to get percentages , and compose a tooltip
        // The percentage is NOT necessary for the pie chart itself, but makes for good tooltip content
        // The final structure necessary for drawPieChart() is a list of objects,
        // each object containing value, label, and tooltip
        var thisdata = [];
        var thistotal = 0; for (var label in PIE_DATA) thistotal += PIE_DATA[label];
        for (var label in PIE_DATA) {
            var value   = PIE_DATA[label];
            var percent = Math.round(100 * value / thistotal);
            var tooltip = 'Age ' + label + '<br/>' + value + ' out of ' + thistotal + ' (' + percent + ' %)';
            thisdata.push({ label:label, value:value, tooltip:tooltip });
        }
        var width = 175, height = 125;
        drawPieChart(thisdata,'#piechart_age_of_participants',width,height,QUALITATIVE_COLORS,true);


        // bar chart example
        // Add up the counts from individual slicesa to get percentages , and compose a tooltip
        // The percentage is NOT necessary for the pie chart itself, but makes for good tooltip content
        // The final structure necessary for drawSingleValueBarChart() is three lists: values, labels, and tooltips
        var values   = [];
        var labels   = [];
        var tooltips = [];
        var thistotal = 0; for (var label in BAR_DATA) thistotal += BAR_DATA[label];
        for (var label in BAR_DATA) {
            var value   = BAR_DATA[label];
            var percent = Math.round(100 * value / thistotal);
            var tooltip = label + '<br/>' + value + ' out of ' + thistotal + ' (' + percent + ' %)';

            values.push(value);
            labels.push(label);
            tooltips.push(tooltip);
        }
        var width = 400, height = 150;
        drawSingleValueBarChart(values,labels,tooltips,'#barchart_last_visit',width,height,SINGLE_BAR_COLOR,null);


        // word cloud example
        // the final structure necessary for drawWordCloud() is simply the list of words
        // note that word clouds are not a core part of D3. cheers to Jason Davies
        var words  = WORDCLOUD_DATA;
        var width  = 500, height = 300;
        drawWordCloud(words,'#wordcloud_other_activities',width,height,QUALITATIVE_COLORS);


}
