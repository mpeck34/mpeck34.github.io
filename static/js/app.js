// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    var metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    var filteredMetadata = metadata.filter(obj => obj.id === sample)[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    var metadataPanel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    metadataPanel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(filteredMetadata).forEach(([key, value]) => {
      metadataPanel.append("p").text(`${key}: ${value}`);
    });
  });
}


// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    var samples = data.samples;

    // Filter the samples for the object with the desired sample number
    var filteredSample = samples.filter(obj => obj.id === sample)[0];

    // Get the otu_ids, otu_labels, and sample_values
    var otu_ids = filteredSample.otu_ids;
    var otu_labels = filteredSample.otu_labels;
    var sample_values = filteredSample.sample_values;

    // Build a Bubble Chart
    var trace1 = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids
      }
    };


    // Render the Bubble Chart
    var dataBubble = [trace1];

    var layoutBubble = {
      xaxis: { title: "OTU ID" },
    };

    Plotly.newPlot('bubble', dataBubble, layoutBubble);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    var yticks = otu_ids.slice(0, 10).map(otu_id => `OTU ${otu_id}`).reverse();

    // Build a Bar Chart
    var trace2 = {
      x: sample_values.slice(0, 10).reverse(),
      y: yticks,
      text: otu_labels.slice(0, 10).reverse(),
      type: 'bar',
      orientation: 'h'
    };

    // Don't forget to slice and reverse the input data appropriately
    var dataBar = [trace2];

    var layoutBar = {
      title: 'Top 10 OTUs Found',
      margin: { t: 30, l: 150 }
    };

    // Render the Bar Chart
    Plotly.newPlot('bar', dataBar, layoutBar);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    var names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    var dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    names.forEach((sample) => {
      dropdown.append("option").text(sample).property("value", sample);
    });

    // Get the first sample from the list
    var firstSample = names[0];

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}


// Initialise the dashboard
init();
