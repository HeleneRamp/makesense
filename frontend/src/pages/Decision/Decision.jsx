import "./Decision.scss";
import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDecisionContext } from "../../contexts/decisionContext";
import { AuthContext } from "../../contexts/authContext";
import DescriptionBox from "../../components/DescriptionBox/DescriptionBox";
import CommentSection from "../../components/CommentSection/CommentSection";
import ProgressBar from "../../components/ProgressBar/ProgressBar";

function Decision() {
  const { user } = useContext(AuthContext);
  const [comment, setComment] = useState("");
  const { decisions, decisionId, editedDecisions } = useDecisionContext();
  const [writeComment, setWriteComment] = useState();
  const [decision, setDecision] = useState({});
  const navigate = useNavigate();

  // Redirect unconnected users
  useEffect(() => {
    if (!user[0].user_id) {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/decisions/${decisionId}`)
      .then((response) => response.json())
      .then((data) => setDecision(data))
      .catch((error) => console.error(error));
  }, [decisions, editedDecisions]);

  return (
    <main className="decision__page">
      <header className="decision__page--header">
        <section className="decision__header">
          <h2 className="openAndClose__date">
            <strong>Date d'ouverture:</strong> {decision.french_date} <br />
            <strong>Date de clôture:</strong> {decision.decision_delay}
          </h2>
          {user[0].user_id === decision.user_id && (
            <Link to="/decision/update" className="decision__edit">
              Editer la décision
            </Link>
          )}
        </section>
        <ProgressBar status={decision.status} />
      </header>
      <section className="decision__page--body">
        <section className={`left__section ${writeComment && "hidden"}`}>
          <DescriptionBox
            title={decision.decision_title}
            status={decision.status}
            location={decision.location}
            comments={decision.nb_comments}
            picture={decision.picture}
            firstname={decision.firstname}
            lastname={decision.lastname}
            paragraphBenefits={decision.paragraph_benefits}
            paragraphDecision={decision.paragraph_decision}
            paragraphDetails={decision.paragraph_details}
            paragraphFinaleDecision={decision.paragraph_finale_decision}
            paragraphFirstDecision={decision.paragraph_first_decision}
            paragraphImpact={decision.paragraph_impact}
            paragraphRisks={decision.paragraph_risks}
          />
        </section>
        <section className={`right__section ${!writeComment && "hidden"}`}>
          <CommentSection
            comment={comment}
            setComment={setComment}
            user={user}
            decisionId={decisionId}
          />
        </section>
        <input
          value={writeComment ? "Voir la décision" : "Voir les commentaires"}
          onClick={() => setWriteComment(!writeComment)}
          type="button"
          className="commentLink__button"
        />
      </section>
    </main>
  );
}

export default Decision;
