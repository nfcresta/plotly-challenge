// initialize function and use d3 to read in samples.json
function init(){
    d3.json("../../samples.json").then(data => {
        
        console.log(data);

        // create list of id names
        var IDs = data.names;

        // push id's to dropdown menu
        for (var i=0; i <= IDs.length; i++){
            dropdownMenu = d3.select("#selDataset");
            options = dropdownMenu.append("option");
            options.text(IDs[i]);
        }

        // create inital plots
        var firstID = IDs[0];
        updatePlots(firstID);
        updateMetadata(firstID);
    });
}

function updatePlots(sample){
    d3.json("../../samples.json").then(data => {
        var samples = data.samples;
        var filterArr = samples.filter(sampleObject => sampleObject.id === sample);
        var result = filterArr[0];
        var sampleValues = result.sample_values;
        var otuIDs = result.otu_ids;
        var otuLabels = result.otu_labels;

        // create bar chart
        var trace1 = {
            x: sampleValues.slice(0, 10).reverse(),
            y: otuIDs.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
            type: "bar",
            orientation: "h"
        };

        var data = [trace1];

        var layout = {
            title: ""
        };

        Plotly.newPlot("bar", data, layout);

        // create bubble chart
        var trace2 = {
            x: otuIDs,
            y: sampleValues,
            marker: {
                size: sampleValues,
                color: otuIDs,
                colorscale: "electric"
            },
            text: otuLabels,
            mode: "markers"
        };

        var data = [trace2];
        var layout = {
            hovermode: "closest",
            xaxis: {title: `OTU ID ${sample}`}
        };

        Plotly.newPlot("bubble", data, layout);
    });
}

// demographics panel
function updateMetadata(sample){
    d3.json("../../samples.json").then(data => {
        var metaData = data.metadata;
        var filterArr = metaData.filter(sampleObject => sampleObject.id == sample);
        var result = filterArr[0];
        var demoPanel = d3.select("#sample-metadata");
        demoPanel.html("");
        Object.entries(result).forEach(([key, value]) => {
            demoPanel.append("h6").text(`${key}: ${value}`)
        });
    });
}

// complete optionChanged function
function optionChanged(newID){
    updatePlots(newID);
    updateMetadata(newID);
}

init();
