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
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Create the buildChart function.
function buildCharts(sample) {
  // Use d3.json to load the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data);

    var samples = data.samples;
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];

    var metadata = data.metadata;
    var metadataArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var metaresult = metadataArray[0];
    var wfreq = metaresult.wfreq;

    var ids = result.otu_ids;
    var labels = result.otu_labels;
    var values = result.sample_values;
    var yticks = ids.map(id => `OTU ${id}`).slice(0,10).reverse();
    
    console.log(result, "result")
    console.log(resultArray, "results")
    console.log(ids, "id")
    console.log(wfreq, "wfreq")
    console.log(labels, "labels")
    console.log(values, "values")

    var trace1 = {
      x: values.slice(0, 10).reverse(),
      y: yticks,
      type: "bar",
      orientation: "h",
    };

    var databar = [trace1]

    var layout = {
      title: "TOP 10 BACTERIA CULTURES FOUND",
      xaxis: { title: "Bacteria Values"},
      yaxis: { title: "OTU_IDS"}
    };

    Plotly.newPlot("bar", databar, layout);

    
    var trace2 = {
      x: ids,
      y: values,
      text: labels,
      mode: 'markers',
      marker: {
        color: ids,
        colorscale: 'Electric',
        size: values,
        }
      };
      var dataBubble = [trace2]
      var layoutbubble = {
        title: "TOP 10 BACTERIA FOUND",
        xaxis: {title: "OTU_IDS"},
        hovermode: "text",
      };
     
      Plotly.newPlot("bubble", dataBubble, layoutbubble);
   
    
      // Create the trace for the gauge chart.
     var gaugeData = [{
       domain: {x: [0, 1], y: [0, 1]},
       value: wfreq,
       title: { text: "Belly Button Washing Frequency"},
       type: "indicator",
       mode: "gauge+number",
       gauge: {
         axis: {
            range:[null, 10]
         },
         bar: { color: "black"},
         steps: [
         {range:[0,2], color:"red"},
         {range:[2,4], color:"orange"},
         {range:[4,6], color:"yellow"},
         {range:[6,8], color:"lightgreen"},
         {range:[8,10], color:"green"}
        ]
      }
     }];

     var glayout = { width: 600, height: 500, margin: { t: 0, b: 0 } };

     Plotly.newPlot("gauge", gaugeData, glayout);
  });
}