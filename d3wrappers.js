/*
    generic wrapper for drawing a pie chart
    data is a list of objects, each one having these keys:  data, label, tooltip
*/
function drawPieChart(data,selector,width,height,colors,labels) {
    // the callbacks to return the label or value from one of the "data" elements passed in
    // it is passed 2 params: the datum being handled, and the slice's index (starts at 0 for first slice)
    function retrieveValueFromDatum(datum,index) {
        return datum.value;
    }
    function retrieveLabelForSlice(datum,index) {
        return datum.data.label;
    }
    function retrieveColorForSlice(datum,index) {
        return colors[index];
    }

    // this is the callback for mousing over a slice
    // it is passed 2 params: the datum being handled, and the slice's index (starts at 0 for first slice)
    // the calling context is the SVG element of the slice, and $(this) will do the jQuery thing properly
    function mouseOverSlice(datum,index) {
        // the behavior here is to look for the SVG's containing div.graph elements, and position a div.charthover over it
        // be sure to enclose the SVG DIV in a div.graph, and set up CSS for div.graphhover
        var container = $(this).closest('.graphwrapper');
        container.find('.graphhover').remove();

        // add the tooltip, so we can get its width & height
        var tooltip = $('<div></div>').addClass('graphhover').html(datum.data.tooltip).appendTo(container);

        // get the mouse position relative to CENTER OF the SVG container
        // add the offset of the container and be sure the container uses position:relative, and voila
        var posx = d3.mouse(this)[0] + 0.5 * tooltip.width() - 20;
        var posy = d3.mouse(this)[1] + tooltip.height() - 5;
        tooltip.css({
            top: posy + 'px', left: posx + 'px'
        });
    }
    function mouseOutSlice(datum,index) {
        var container = $(this).closest('.graphwrapper');
        container.find('.graphhover').remove();
    }

    // the radius of the circle, and padding around it if they want labels
    var radius = Math.min(width, height) / 2;
    var xoff = width / 2;
    var yoff = height / 2;
    var padding = 0;
    if (labels) {
        padding = 10;
        radius -= 2 * padding;
    }

    // a bunch of arcana we hope never to touch
    var arc = d3.svg.arc().outerRadius(radius-1).innerRadius(0);
    var pie = d3.layout.pie().sort(null).value(retrieveValueFromDatum);
    var svg = d3.select(selector).append("svg").attr("width", width).attr("height", height).append("g").attr("transform", "translate(" + xoff + "," + yoff + ")");
    var slices = svg.selectAll(".arc").data(pie(data)).enter().append("g").attr("class", "arc").append("path").attr("d", arc);
    slices.style("fill", retrieveColorForSlice);

    // add some interaction when you mouse over a slice
    svg.selectAll(".arc").on('mouseover', mouseOverSlice).on('mouseout', mouseOutSlice);

    // add labels
    if (labels) {
        svg.selectAll(".arc").append("svg:text").attr("transform", function(d) {
            var c = arc.centroid(d), x = c[0], y = c[1], h = Math.sqrt(x*x + y*y); // pythagorean theorem for hypotenuse
            var labelradius = radius + padding;
            return "translate(" + (x/h * labelradius) +  ',' + (y/h * labelradius) +  ")"; 
        }).attr("text-anchor", function(d) {
            // position the text
            //console.log([ d.data.label, d.endAngle/Math.PI, d.startAngle/Math.PI ]);

            // are we straddling the bottom of the pie?
            if (d.startAngle >= Math.PI*0.8 && d.endAngle <= Math.PI*1.2) return "middle";

            // the default position calculation: right-hand side of the pie vs left-hand side vs bottom-middle
            if (d.startAngle <= Math.PI*0.8) return "start";
            if (d.endAngle >  Math.PI*1.2) return "end";
            return "middle";
        }).text(retrieveLabelForSlice);
    }
}



/*
    generic wrapper for drawing a bar chart with only 1 value per column (as opposed to drawMultiValueBarChart)
    data is a list of objects, each one having these keys:  data, label, tooltip
*/
function drawSingleValueBarChart(values,labels,tooltips,selector,width,height,color,y_max,bottom_margin) {
    // padding between bars, and for the X and Y axis labels (bottom and left)
    var padding_between_bars = 1;
    if (!bottom_margin) bottom_margin = 75;
    var left_margin   = 50;
    var top_margin    = 10;

    // the callbacks for mouse activity
    function mouseOverBar(value,index) {
        // the behavior here is to look for the SVG's containing div.graph elements, and position a div.charthover over it
        // be sure to enclose the SVG DIV in a div.graph, and set up CSS for div.graphhover
        var container = $(this).closest('.graphwrapper');
        container.find('.graphhover').remove();

        // add the tooltip, so we can get its width & height
        var tooltip = $('<div></div>').addClass('graphhover').html(tooltips[index]).appendTo(container);

        // get the mouse position relative to CENTER OF the SVG container
        // add the offset of the container and be sure the container uses position:relative, and voila
        var posx = d3.mouse(this)[0];
        var posy = d3.mouse(this)[1] - tooltip.height() + 13;
        tooltip.css({
            top: posy + 'px', left: posx + 'px'
        });
    }
    function mouseOutBar(value,index) {
        var container = $(this).closest('.graphwrapper');
        container.find('.graphhover').remove();
    }

    function determineBarHeightFromData(value) {
        // scale the height based on this value as a percentage of y_max
        // but also enforce a minimum, cuz it's difficult to mouse over a 1px-high rectangle
        var bar_height = Math.round(height * (value / y_max));
        if (bar_height < 4) bar_height = 4;
        return bar_height;
    }

    // automatic Y scaling: find the highest value of the supplied data, use that as the maximum Y
    if (! y_max) y_max = Math.max.apply(Math,values);

    // find the sum of the 

    // create SVG element
    // add some extra padding for the X and Y axis labels
    var svg = d3.select(selector).append("svg").attr("width", width + left_margin).attr("height", height + bottom_margin + top_margin);

    // create the rectangles for the bars, load the values, set up the width/height/x/y and color for the bars
    svg.selectAll("rect").data(values).enter().append("rect")
    .attr('transform','translate('+left_margin+','+top_margin+')')
    .attr("x", function(datum,index) {
        // X position is this bar's number x the width of a bar
        return index * (width / values.length);
    })
    .attr("y", function(datum,index) {
        // Y position is the height of the chart minus the height of the bar
        return height - determineBarHeightFromData(datum);
    })
    .attr("height", function(datum,index) {
        return determineBarHeightFromData(datum);
    })
    .attr("width", width / values.length - padding_between_bars)
    .attr("fill", function(datum,index) {
        return color; // passed as a parameter
    })
    .on('mousemove', mouseOverBar).on('mouseout', mouseOutBar);

    // add the Y axis
    var y_scale = d3.scale.linear().domain([0,y_max]).range([height,0]);
    svg.append("g").call( d3.svg.axis().scale(y_scale).orient("left") )
        .attr('class','yaxis').attr('height',height).attr('transform','translate('+left_margin+','+top_margin+')');

    // add the X axis
    // the domain is the list of labels (X notches) and it is mapped onto a range of X values (positions)
    // so: generate the list of X positions for labels, calculate a scale for this
    var label_xs = [];
    for (var i=0, l=labels.length; i<l; i++) label_xs.push( (i+0.5) * (width / l) );
    var x_scale = d3.scale.ordinal().domain(labels).range(label_xs);
    svg.append("g").call( d3.svg.axis().scale(x_scale).orient("bottom") )
        .attr('class','xaxis').attr('transform','translate('+left_margin+','+(height+top_margin)+')')
        .selectAll("text")
            .style("text-anchor", "start")
            .attr("dx", 10)
            .attr("dy", (width/labels.length)*-0.10 )
            .attr("transform", function(d) {
                return "rotate(90)";
            });
}




/*
    generic wrapper for drawing a word cloud
    words is an assocarray, mapping word to frequency; this is used for sizing
*/
function drawWordCloud(words,selector,width,height,colors) {
    // construct the words data: list of objects {text,size}
    var data = [];
    for (var word in words) data.push({
        text:word,
        size: Math.max(8,Math.min(1.0*words[word],50))
    });

    // start it up, see the draw() callback below
    d3.layout.cloud().size([width,height]).words(data)
    .rotate(function() { return ~~(Math.random() * 2) * 90; })
    .font("Impact")
    .fontSize(function(d) { return d.size; })
    .on("end", draw)
    .start();

    function draw(words) {
        d3.select(selector).append("svg").attr("width", width).attr("height", height)
        .append("g")
        .attr("transform", "translate("+width/2+","+height/2+")")
        .selectAll("text")
        .data(words)
        .enter().append("text")
        .style("font-size", function(datum) {
            return datum.size + "px";
        })
        .style("font-family", "Impact")
        .style("fill", function(datum, index) {
            return colors[index % colors.length];
        })
        .attr("text-anchor", "middle")
        .attr("transform", function(d) {
            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function(d) { return d.text; });
    }
}

