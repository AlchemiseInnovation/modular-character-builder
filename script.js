const canvas = document.getElementById("characterCanvas");
const ctx = canvas.getContext("2d");
const builderDiv = document.getElementById("builder");
const selectedBits = {};
const schemaUrl = "data/schema.json";

// Load schema and render buttons
async function loadSchema() {
  const res = await fetch(schemaUrl);
  const data = await res.json();
  renderSelectors(data.categories);
}

function renderSelectors(categories) {
  categories.forEach(cat => {
    const section = document.createElement("div");
    section.innerHTML = `<h2>${cat.name}</h2>`;
    cat.options.forEach(opt => {
      const btn = document.createElement("button");
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

// Draw selected layers (no watermark)
function drawCharacter() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const layerOrder = ["Pumpkin", "Face", "Body", "Head", "Aura"];
  layerOrder.forEach(layer => {
    const src = selectedBits[layer];
    if (src) {
      const img = new Image();
      img.src = src;
      img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
  });
}

// Download with watermark
document.getElementById("downloadBtn").onclick = () => {
  const watermark = new Image();
  watermark.src = "assets/watermark/alchemise_innovation.png";
  watermark.onload = () => {
    ctx.drawImage(watermark, 0, 0, canvas.width, canvas.height);
    const link = document.createElement("a");
    link.download = "character.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
    drawCharacter(); // Re-render without watermark
  };
};

// Email with asset list
document.getElementById("emailBtn").onclick = () => {
  const email = "aiclothingbytsm@gmail.com"; // Replace with your email
  const subject = "Character Build Submission";

  const selections = Object.entries(selectedBits)
    .map(([key, value]) => {
      const filename = value.split("/").pop();
      return `${key}: ${filename}`;
    })
    .join("%0D%0A");

  const body = `Hi,%0D%0A%0D%0AHere is my character build submission:%0D%0A%0D%0A${selections}%0D%0A%0D%0AI'll attach the image manually.%0D%0A%0D%0AThanks!`;

  const mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`;
  window.location.href = mailtoLink;
};

loadSchema();
