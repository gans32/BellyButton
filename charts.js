function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    console.log(data);
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
init()

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
};

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
   var samples = data.samples;
   // 4. Create a variable that filters the samples for the object with the desired sample number.   
   var filteredSamples = samples.filter(sampleObj => sampleObj.id == sample);
   
    //  5. Create a variable that holds the first sample in the array.
    var firstSample = filteredSamples[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = firstSample.otu_ids
    var otu_labels = firstSample.otu_labels
    var sample_values = firstSample.sample_values
    // var washFreq = parseFloat(firstSample.wfreq);
    
    var filtered_otu_ids = otu_ids.slice(0.10).reverse();
    var filtered_otu_labels = otu_labels.slice(0,10).reverse();
    var filtered_sample_values = sample_values.slice(0,10).reverse();
    
    // 7. Create the yticks for the bar chart.
       var yticksBar = otu_ids.slice(0,10).map(otu_id => `OTU ${otu_id}`).reverse();

    // 8. Create the trace for the bar chart. 
    var barData = [{
        x: filtered_sample_values,
        y: yticksBar,
        type: 'bar',
        orientation: 'h',
        text: filtered_otu_labels,
      }];
      
    // 9. Create the layout for the bar chart. 
    var barLayout = {
        title: "Top 10 Bacteria for this Individual"
     
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot('bar', barData, barLayout);

    var bubble = [{
        x: filtered_otu_ids,
        y: filtered_sample_values,
        text: filtered_otu_labels,
        mode: 'markers',
        marker: {
            size: filtered_sample_values,
            color: otu_ids,
            colorscale: "Earth"
            }
        }];        
        
    var bubbleLayout = {
      title: "Bacteria Cultures per Sample",
      xaxis: { title: "OUT ID"},
      // yaxis: { title: "Number of Samples"},
      height: 600,
      width: 1100,
    };
    Plotly.newPlot('bubble', bubble, bubbleLayout);

//Create a variable that holds the washing frequency.
    var gauge = data.metadata;
      // Filter the data for the object with the desired sample number
    var gaugeArray = gauge.filter(sampleObj => sampleObj.id == sample);
    var gaugeResult = gaugeArray[0]
    var washFreq= parseFloat(gaugeResult.wfreq);
   
    var gaugeData = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: washFreq,
        title: { text: "Belly Button Washing Frequency" },
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: {range: [null, 10]},
          bar: {color: "black"},
          steps: [
            {range: [0,2], color: "red"},
            {range: [2,4], color: "orange"},
            {range: [4,6], color: "yellow"},
            {range: [6,8], color: "limegreen"},
            {range: [8,10], color: "green"},
          ],
        },
      }
    ]; 

    var gaugeLayout = [{
      width: 600, 
      height: 500, 
      margin: { t: 0, b: 0 } }];
  Plotly.newPlot('gauge', gaugeData, gaugeLayout);
  });
}