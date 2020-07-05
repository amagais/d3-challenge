// function used for updating x-scale var upon click on axis label
function xScale(data, chosenXAxis) {
    // create scales
    
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => d[chosenXAxis]) * 0.8,
        d3.max(data, d => d[chosenXAxis]) * 1.2
      ])
      .range([0, width]);
  
    return xLinearScale;
  
}

// function used for updating y-scale var upon click on axis label
function yScale(data, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => d[chosenYAxis]) * 0.8,
        d3.max(data, d => d[chosenYAxis]) * 1.2
      ])
      .range([height, 0]);
  
    return yLinearScale;
  
}

function renderYAxes(newXScale, yAxis) {
    var leftAxis = d3.axisLeft(newXScale);
  
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
  
    return yAxis;
}

// function used for updating circles group with a transition to
  // new circles
function renderXCircles(circlesGroup, newXScale, chosenXAxis) {
  
    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]))
  
    return circlesGroup;
}

function renderYCircles(circlesGroup, newYScale, chosenYAxis) {
  
    circlesGroup.transition()
      .duration(1000)
      .attr("cy", d => newYScale(d[chosenYAxis]))
  
    return circlesGroup;
}

 // function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
  
}

function renderXText(circlesGroup, newXScale, chosenXAxis){
    circlesGroup.transition()
        .duration(1000)
        .attr("dx", d=> newXScale(d[chosenXAxis]));

    return circlesGroup;
}

function renderYText(circlesGroup,newYScale,chosenYAxis){
    circlesGroup.transition()
        .duration(1000)
        .attr("dy", d=> newYScale(d[chosenYAxis]));
    return circlesGroup;
}

 // function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
  
    var x_label;
    var y_label;
    //conditionals for X axis 
    if (chosenXAxis === "poverty") {
      x_label = "Poverty: ";
    }
    else if (chosenXAxis === "age") {
        x_label = "Age: ";
      }
    else {
      x_label = "Income: ";
    }

    //conditions for Y axis 
    if (chosenYAxis === "healthcare"){
      y_label = "Lacks Healthcare (%): ";
    }

    else if (chosenYAxis == "smokes"){
      y_label = "Smokes (%): "
    }
    else {
      y_label = "Obesity(%): "
    }
  
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.abbr}<br>${x_label} ${d[chosenXAxis]} <br> ${y_label} ${d[chosenYAxis]}`);
      });
  
    circlesGroup.call(toolTip);
  
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
  
    return circlesGroup;
}