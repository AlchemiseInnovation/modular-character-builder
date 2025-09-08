const schemaUrl = 'data/schema.json';
const canvas = document.getElementById('characterCanvas');
const ctx = canvas.getContext('2d');
const builderDiv = document.getElementById('builder');
const selectedBits = {};

async function loadSchema() {
  const res = await fetch(schemaUrl);
  const data = await res.json();
  renderSelectors(data.categories);
}

function renderSelectors(categories) {
  categories.forEach(cat => {
    const section = document.createElement('div');
    section.innerHTML = `<h2>${cat.name}</h2>`;
    cat.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.textContent = opt.label;
      btn.onclick = () => {
        selectedBits[cat.name] = opt.image;
        drawCharacter();
      };
      section.appendChild(btn);
    });
    builderDiv.appendChild(section);
  });
}

function drawCharacter() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  Object.values(selectedBits).forEach(src => {
    const img = new Image();
    img.src = src;
    img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  });
}

document.getElementById('printButton').onclick = () => {
  alert('Print flow coming soon. This will send your design to a secure render endpoint.');
};

loadSchema();
