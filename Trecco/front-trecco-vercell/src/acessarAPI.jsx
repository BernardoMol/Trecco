// const baseUrl = 'https://SEU_BACKEND.com/api';
// const baseUrl = 'http://localhost:5233/api';

// export async function AcessarAPI(endpoint, options) {

//   const response = await fetch(`${baseUrl}${endpoint}`, options);

//   if (!response.ok) {
//     const errorData = await response.json();
//     throw new Error(errorData.message || 'Erro na requisição');
//   }

//   return response.json(); // retorna o JSON da resposta
// }


// const baseUrl = 'https://SEU_BACKEND.com/api';
// const baseUrl = 'http://localhost:5233/api';

const baseUrl = import.meta.env.VITE_API_URL;

export async function AcessarAPI(endpoint, options) {
  const response = await fetch(`${baseUrl}${endpoint}`, options);

  const contentType = response.headers.get('content-type');

  if (!response.ok) {
    let errorMessage = 'Erro na requisição';

    if (contentType && contentType.includes('application/json')) {
      const errorData = await response.json();
      errorMessage = errorData.message || JSON.stringify(errorData);
    } else {
      const errorText = await response.text();
      if (errorText) errorMessage = errorText;
    }

    throw new Error(errorMessage);
  }

  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  }

  return null; // ou `await response.text()` se você quiser o texto da resposta
}
