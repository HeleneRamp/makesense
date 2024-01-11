import "./Homepage.scss";
import { useState, useEffect } from "react";
import SecondaryNav from "../../components/SecondaryNav/SecondaryNav";
import DecisionCard from "../../components/DecisionCard/DecisionCard";

function Homepage() {
  const [decisions, setDecisions] = useState();
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/decisions/all`)
      .then((response) => response.json())
      .then((data) => setDecisions(data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <>
      <SecondaryNav />
      <h1 className="homepage__title">Décisions en cours</h1>
      <main className="homepage__main">
        {decisions
          ? decisions.map((card) => (
              <DecisionCard
                title={card.decision_title}
                status={card.status}
                authorFirstname={card.firstname}
                authorLastname={card.lastname}
                location={card.location}
                comments={card.nb_comments}
                picture={card.picture}
              />
            ))
          : "Loading"}
      </main>
    </>
  );
}

export default Homepage;
