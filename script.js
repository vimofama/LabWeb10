const fileInput = document.getElementById('fileInput');
const fileInfo = document.getElementById('fileInfo');
const preview = document.getElementById('preview');
const progressBar = document.getElementById('progressBar');

const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
const maxFileSize = 100 * 1024 * 1024; // 5 MB in bytes

fileInput.addEventListener('change', function(event) {
  const selectedFile = event.target.files[0];

  if (selectedFile) {
    const fileExtension = selectedFile.name.split('.').pop().toLowerCase();

    if (allowedExtensions.includes('.' + fileExtension) && selectedFile.size <= maxFileSize) {
      fileInfo.innerHTML = `
        Nombre del archivo: ${selectedFile.name}<br>
        Tipo MIME: ${selectedFile.type}<br>
        Tamaño: ${selectedFile.size} bytes
      `;

      if (selectedFile.type.startsWith('image/')) {
        preview.style.display = 'block';
        const reader = new FileReader();

        reader.onload = function(e) {
          preview.src = e.target.result;
        };

        reader.readAsDataURL(selectedFile);
      } else {
        preview.style.display = 'none';
      }

      // Upload the file using Axios
      const formData = new FormData();
      formData.append('file', selectedFile);

      const config = {
        onUploadProgress: progressEvent => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          progressBar.value = percentCompleted;
        }
      };

      axios.post('http://localhost:3000/upload', formData, config)
        .then(response => {
          // Handle success if needed
        })
        .catch(error => {
          // Handle error if needed
        });
      
    } else {
      fileInfo.innerHTML = 'Archivo no válido. Por favor, selecciona un archivo .jpg, .png o .gif que sea máximo 5 MB.';
      preview.style.display = 'none';
    }
  } else {
    fileInfo.innerHTML = '';
    preview.style.display = 'none';
  }
});
