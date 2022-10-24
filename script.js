import { orderedID, orderedTags } from './altTags.js';
import tagData from './tagData.js';

window.addEventListener('load', (event) => {
    displayTags();
  });

const metUrl = 'https://collectionapi.metmuseum.org/public/collection/v1/objects'


const getTags = () => {
    const tagArray = [];
    do {
        const tagNum = Math.floor(Math.random() * tagData.length);
        const tag = tagData[tagNum].tag;
        const id = tagData[tagNum].id;
        let exists = tagArray.find(el => el[0] === tag);
        if (!exists) {
            tagArray.push([tag, id]);
        }  
    } while (tagArray.length < 3)
    return tagArray;
}

const displayTags = () => {
    const root = document.getElementById('select');
    root.innerHTML = '';
    const form = document.createElement('form');
    root.appendChild(form);
    const allTags = getTags();
    for (let tag of allTags) {
        const selectDiv = document.createElement('div');
        selectDiv.setAttribute('class', 'select');
        form.appendChild(selectDiv);
        const input = document.createElement('input');
        input.setAttribute('type', 'radio');
        input.setAttribute('id', `${tag[1]}`);
        input.setAttribute('value', `${tag[0]}`);
        input.setAttribute('name', 'displayTags')
        input.addEventListener('click', function() { getArt(this.value, this.id) });
        const label = document.createElement('label');
        label.setAttribute('for', `${tag[1]}`)
        label.innerHTML = tag[0];
        selectDiv.appendChild(input);
        selectDiv.appendChild(label);
    }
}

const getArt = async (value, id) => {
    console.log(value);
    const idNum = id;
    const endpoint = `${metUrl}/${idNum}`;
    try {
        const response = await fetch(endpoint, {cache: 'no-cache'});
        if (response.ok) {
            const jsonResponse = await response.json();
            renderResponse(jsonResponse)
        }
    } catch (error) {
        console.log(error)
    }
}

const renderResponse = (val) => {
    const background = document.getElementById('background');
    let imgDimensions;
    if (val.measurements.length > 1) {
        const imgFilter = val.measurements.filter(el => el.elementName == 'Overall')
        imgDimensions = imgFilter[0]
    } else {
        imgDimensions = val.measurements[0] 
    }
    if(imgDimensions.elementMeasurements.Height > imgDimensions.elementMeasurements.width || !imgDimensions.elementMeasurements.width) {
        background.classList.toggle('tall');
    } else {background.classList.toggle('wide');}
    background.style.backgroundImage = `url(${val.primaryImage})`;

    displayHomepage();
}

const displayHomepage = () => {
    const tag = document.getElementById('select');
    const tagSelect = tag.children;
    tag.remove();
    const divArray = ['reselect', 'weather', 'todo', 'right', 'quote'];
    divArray.forEach(el => {
        let div = document.createElement('div');
        div.setAttribute('class', el);
        let app = document.getElementById('app');
        app.appendChild(div);
    })
}
