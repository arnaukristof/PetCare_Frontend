export interface Picture {
  id: number;
  name: string;
}

export async function getPictures(id: number): Promise<Picture> {
  const response = await fetch(`http://localhost:5290/api/Image/images/${id}`)

  if(!response){
    throw new Error('Failed to fetch image');
  }

  const blob = await response.blob();
  const name = URL.createObjectURL(blob);

  return {
    id,
    name
  };
}