// initialize function and use d3 to read in samples.json
function init(){
    d3.json("../../samples.json").then(data => {
        
        console.log(data);

        // create list of id names
        var IDs = data.names;

        // push id's to dropdown menu
        for (var i=0; i <= IDs.length; i++){
            var dropdownMenu = d3.select("#selDataset");
            var options = dropdownMenu.append("option");
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
        var metaData = data.metadata;
        var filterArrm = metaData.filter(sampleObject => sampleObject.id == sample);
        var resultm = filterArrm[0];

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

        // BONUS create gauge
        var data = [
            {
                domain: { x: [0, 1], y: [0,1] },
                marker: {size: 28, color: "850000"},
                value: resultm.wfreq,
                title: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week",
                subtitle: "Scrubs per Week",
                type: "indicator",
                mode: "gauge+number",
                gauge: {
                    axis: { range: [0, 9], tickwidth: 0.5, tickcolor: "black" },
                    bar: { color: "grey" },
                    steps: [
                      { range: [0, 1], color: 'rgba(262, 206, 320, .5)' },
                      { range: [1, 2], color: 'rgba(252, 206, 280, .5)' },
                      { range: [2, 3], color: 'rgba(242, 206, 240, .5)' },
                      { range: [3, 4], color: 'rgba(232, 206, 202, .5)' },
                      { range: [4, 5], color: 'rgba(210, 206, 145, .5))' },
                      { range: [5, 6], color: 'rgba(202, 209, 95, .5)' },
                      { range: [6, 7], color: 'rgba(170, 202, 42, .5)' },
                      { range: [7, 8], color: 'rgba(110, 154, 22, .5)' },
                      { range: [8, 9], color: 'rgba(14, 127, 0, .5)' }
                    ],
                  }  
                }
        ];

        var layout = {
            line: {color: "600000"},
            wdith: 600,
            height: 500,
            margin: { t: 0, b: 0 }
        };

        Plotly.newPlot("gauge", data, layout);
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

app.use("/static/js", express.static('./static/js/'));
