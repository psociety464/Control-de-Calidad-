// Array para almacenar comentarios predeterminados
const predefinedComments = [
    "Revisado y aprobado",
    "Pendiente de revisión",
    "Corregir en próxima versión",
    "Prioridad alta",
    "Funcionalidad completa"
];

// Elementos del DOM
const elements = {
    predefinedCommentsContainer: document.getElementById('predefinedComments'),
    fileContent: document.getElementById('fileContent'),
    newPredefinedComment: document.getElementById('newPredefinedComment'),
    segmentText: document.getElementById('segmentText'),
    blockText: document.getElementById('blockText'),
    commentText: document.getElementById('commentText'),
    fileName: document.getElementById('fileName'),
    fileInput: document.getElementById('fileInput')
};

// Event Listeners
document.getElementById('addPredefinedBtn').addEventListener('click', addPredefinedComment);
document.getElementById('addSegmentBtn').addEventListener('click', addSegment);
document.getElementById('addBlockBtn').addEventListener('click', addBlock);
document.getElementById('addCommentBtn').addEventListener('click', addComment);
document.getElementById('saveBtn').addEventListener('click', saveToFile);
document.getElementById('loadBtn').addEventListener('click', () => elements.fileInput.click());
elements.fileInput.addEventListener('change', handleFileSelect);

// Cargar comentarios predeterminados al iniciar
updatePredefinedCommentsDisplay();

// Función para actualizar la visualización de comentarios predeterminados
function updatePredefinedCommentsDisplay() {
    const container = elements.predefinedCommentsContainer;
    container.innerHTML = '';
    
    predefinedComments.forEach(comment => {
        const button = document.createElement('button');
        button.textContent = comment;
        button.onclick = () => addPredefinedCommentToContent(comment);
        container.appendChild(button);
    });
}

// Función para agregar un nuevo comentario predeterminado
function addPredefinedComment() {
    const newComment = elements.newPredefinedComment.value.trim();
    if (newComment && !predefinedComments.includes(newComment)) {
        predefinedComments.push(newComment);
        updatePredefinedCommentsDisplay();
        elements.newPredefinedComment.value = '';
    }
}

// Función para agregar un comentario predeterminado al contenido
function addPredefinedCommentToContent(comment) {
    const commentElement = document.createElement('div');
    commentElement.textContent = `# ${comment}`;
    elements.fileContent.appendChild(commentElement);
}

// Función para agregar un segmento
function addSegment() {
    const segmentText = elements.segmentText.value.trim();
    if (segmentText) {
        const segmentDiv = document.createElement('div');
        segmentDiv.className = 'segment';
        segmentDiv.textContent = `[SEGMENTO]\n${segmentText}\n[/SEGMENTO]`;
        elements.fileContent.appendChild(segmentDiv);
        elements.segmentText.value = '';
    }
}

// Función para agregar un bloque
function addBlock() {
    const blockText = elements.blockText.value.trim();
    if (blockText) {
        const blockDiv = document.createElement('div');
        blockDiv.className = 'block';
        blockDiv.textContent = `{BLOQUE}\n${blockText}\n{/BLOQUE}`;
        elements.fileContent.appendChild(blockDiv);
        elements.blockText.value = '';
    }
}

// Función para agregar un comentario
function addComment() {
    const commentText = elements.commentText.value.trim();
    if (commentText) {
        const commentElement = document.createElement('div');
        commentElement.textContent = `# ${commentText}`;
        elements.fileContent.appendChild(commentElement);
        elements.commentText.value = '';
    }
}

// Función para guardar el contenido en un archivo TXT
function saveToFile() {
    const fileName = elements.fileName.value.trim() || 'registro.txt';
    const content = getTextContent(elements.fileContent);
    
    if (!content) {
        alert('No hay contenido para guardar');
        return;
    }
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Función para obtener el texto del contenido
function getTextContent(element) {
    let text = '';
    for (const child of element.childNodes) {
        if (child.nodeType === Node.TEXT_NODE) {
            text += child.textContent;
        } else {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = child.outerHTML;
            const plainText = tempDiv.textContent || tempDiv.innerText;
            text += plainText + '\n';
        }
    }
    return text;
}

// Función para manejar la selección de archivo
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const content = e.target.result;
        elements.fileContent.innerHTML = '';
        
        // Procesar el contenido para mantener formato básico
        const lines = content.split('\n');
        lines.forEach(line => {
            if (line.startsWith('[SEGMENTO]') || line.startsWith('[/SEGMENTO]') || 
                line.includes('SEGMENTO')) {
                const segmentDiv = document.createElement('div');
                segmentDiv.className = 'segment';
                segmentDiv.textContent = line;
                elements.fileContent.appendChild(segmentDiv);
            } else if (line.startsWith('{BLOQUE}') || line.startsWith('{/BLOQUE}') || 
                       line.includes('BLOQUE')) {
                const blockDiv = document.createElement('div');
                blockDiv.className = 'block';
                blockDiv.textContent = line;
                elements.fileContent.appendChild(blockDiv);
            } else if (line.startsWith('#')) {
                const commentDiv = document.createElement('div');
                commentDiv.textContent = line;
                elements.fileContent.appendChild(commentDiv);
            } else {
                const textNode = document.createTextNode(line + '\n');
                elements.fileContent.appendChild(textNode);
            }
        });
        
        // Establecer el nombre del archivo sin extensión
        const fileName = file.name.replace(/\.[^/.]+$/, "");
        elements.fileName.value = fileName + '.txt';
    };
    reader.readAsText(file);
}
