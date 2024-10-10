import {
  useLoaderData,
  Link,
  Form,
  useSearchParams,
  useNavigate,
  useNavigation,
} from "react-router-dom";
import axios from "axios";

const allCars = "http://localhost:5000/api/v1/images"; // Remplacez ceci par l'URL correcte pour récupérer les voitures

export const loader = async () => {
  try {
    const response = await axios.get(allCars);
    return response.data.cars; // Assurez-vous que la structure de votre réponse est correcte
  } catch (error) {
    console.error("Erreur dans le loader :", error);
    throw new Error(
      "Impossible de charger le contenu. Veuillez réessayer plus tard"
    );
  }
};

function Cars() {
  const data = useLoaderData();
  const navigation = useNavigation();

  if (navigation.state === "loading") {
    return (
      <main className="loading-center">
        <div className="loading"></div>
      </main>
    );
  }

  // return (
  //   <section>
  //     {data.map((car) => (
  //       <div key={car.id}>
  //         <h2>
  //           {car.brand} {car.model}
  //         </h2>
  //         <img src={car.image} alt={`${car.brand} ${car.model}`} />
  //       </div>
  //     ))}
  //   </section>
  // );
}

export default Cars;
