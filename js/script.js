const educationDataURL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";
const countryDataURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json';

// legend code 
// legend code 
// legend code 
// legend code 
// legend code 

const legendData = [
    { color: 'hsl(240,100%,50%)', value: '<15%' },
    { color: 'hsl(240,100%,40%)', value: '<30%' },
    { color: 'hsl(240,100%,30%)', value: '<45%' },
    { color: 'hsl(240,100%,20%)', value: '>45%' }];


const legendWidth = 60;
const legendHeight = 30;

const legend = d3.select('#legend');

legend.selectAll('rect')
    .data(legendData)
    .enter()
    .append('rect')
    .attr('fill', d => d.color)
    .attr('width', legendWidth)
    .attr('height', legendHeight)
    .attr('x', (d, i) => i * legendWidth)

legend.selectAll('text')
    .data(legendData)
    .enter()
    .append('text')
    .text(d => d.value)
    .attr('x', (d, i) => (i * legendWidth) + 10)
    .attr('y', 50)


// map code 
// map code 
// map code 
// map code 
// map code 

const width = 960;
const height = 600;

let countryData = undefined;
let educationData = undefined;


const map = d3.select('#countries');


const generateCanvas = () => {
    map.attr('width', width)
    map.attr('height', height)
}

const drawMap = () => {
    const toottip = d3.select('body')
        .append('div')
        .attr('id', 'tooltip')
        .style('visibility', 'hidden')
        .style('position', 'absolute')


    map.selectAll('path')
        .data(countryData)
        .enter()
        .append('path')
        .attr('d', d3.geoPath())
        .attr('class', 'county')
        .attr('fill', d => {
            const id = d.id;
            const county = educationData.find(data => data.fips === id);
            const percentage = county.bachelorsOrHigher;

            if (percentage <= 15) {
                return legendData[0].color
            }
            else if (percentage <= 30) {
                return legendData[1].color
            }
            else if (percentage <= 45) {
                return legendData[2].color
            }
            else {
                return legendData[3].color
            }
        })
        .attr('data-fips', d => d.id)
        .attr('data-education', d => {
            const id = d.id;
            const county = educationData.find(data => data.fips === id);
            const percentage = county.bachelorsOrHigher;
            return percentage;
        })
        .on('mouseover', d => {
            // console.log(d.target.getAttribute('data-education'))
            toottip.style('visibility', 'visible')
            toottip.attr('data-education', d.target.getAttribute('data-education'))
            toottip.style('top', `${d.clientY}px`)
            toottip.style('left', `${d.clientX}px`)
            const id = d.target.__data__.id;
            const county = educationData.find(data => data.fips === id);
            document.querySelector('#tooltip').innerHTML = `

            <h2>${county.area_name}, ${county.state} : ${county.bachelorsOrHigher}%</h2>
            `
        })
        .on('mouseleave', d => {
            toottip.style('visibility', 'hidden')
        })
}



// // fetching api 
d3.json(countryDataURL)
    .then((cData, cErr) => {
        if (cErr) {
            console.log(cErr)
        }
        else {
            countryData = topojson.feature(cData, cData.objects.counties).features;
            // console.log(countryData)

            d3.json(educationDataURL)
                .then((eData, eErr) => {
                    if (eErr) {
                        console.log(eErr)
                    }
                    else {
                        educationData = eData;

                        // console.log(educationData)
                        generateCanvas();
                        drawMap();
                    }
                })
        }
    })







