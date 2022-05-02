function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
  
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
   
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var samplesFiltered = samples.filter(sampleObj =>sampleObj.id ==sample);

    //  5. Create a variable that holds the first sample in the array.
    var sampleSelected = samplesFiltered[0];
    console.log(sampleSelected);

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIdArray = sampleSelected.otu_ids;
    console.log(otuIdArray)
    var otuLabelArray = sampleSelected.otu_labels;
    console.log(otuLabelArray)
    var sampleValuesArray = sampleSelected.sample_values;
    console.log(sampleValuesArray)


    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otuIdArray
    .slice(0,10).map(id=>`OTU ${id}`).reverse();

    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: sampleValuesArray.slice(0,10).reverse(),
      text: otuLabelArray.slice(0,10).reverse(),
      y: yticks,
      type: "bar",
      orientation: "h"
    }
      
    ];
    // 9. Create the layout for the bar chart. 
    var barLayout = {  title: {
      text: "10 Most Prevalent Cultures"
    }
     
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // Bubble chart
  
    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otuIdArray,
      y: sampleValuesArray,
      text: otuIdArray.map(id=>`OTU ${id}`),
      mode: 'markers',
      marker: { 
        size: sampleValuesArray}
    }];
    

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: {
        text: "Cultures In Sample"
      },
      xaxis: {title: "OTU ID"},
      hovermode: "closest",
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    
  // Gauge Chart 

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var filteredMeta = data.metadata.filter(sampleObj => sampleObj.id == sample);

    // 2. Create a variable that holds the first sample in the metadata array.
    var selectedMeta = filteredMeta[0]; 

    // 3. Create a variable that holds the washing frequency.
    washF = selectedMeta.wfreq;

    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      value: washF,
      title: {
        text: "Wash Frequency"},
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: {range: [null, 10]},
        bar: {color: "white"},
        steps: [
          {range: [0,2], color: "rgb(55,0,200)"},
          {range: [2,4], color: "rgb(85,0,170)"},
          {range: [4,6], color: "rgb(105,0,150)"},
          {range: [6,8], color: "rgb(125,0,130)"}, 
          {range: [8,10], color: "rgb(145,0,110)"}        
        ]
      }
    }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 500,
      height: 400
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);

  });
}
