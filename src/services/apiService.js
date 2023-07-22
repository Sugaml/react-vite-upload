// apiService.js
export const uploadFile = async (file, fileType) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileType', fileType);
  
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `http://localhost:8080/uploads`, true);
  
        xhr.onload = function () {
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            resolve(response.data.fileUrl); // Resolve with the file URL from the response
          } else {
            reject(new Error('Failed to upload the file'));
          }
        };
  
        xhr.onerror = function () {
          reject(new Error('Failed to upload the file'));
        };
  
        xhr.send(formData);
      });
    } catch (error) {
      throw error;
    }
  };
  