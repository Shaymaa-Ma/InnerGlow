import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/Home.css";

const Home = () => {
  const [scrolled, setScrolled] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const [heroImg, setHeroImg] = useState("");
  const [homeBg, setHomeBg] = useState("");
  const [features, setFeatures] = useState([]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    axios.get("http://localhost:5000/api/home")
      .then((res) => {
        const data = res.data;
        setHeroImg(data.heroImg || "");
        setHomeBg(data.homeBg || "");
        setFeatures(data.features || []);
        setReviews(data.reviews || []);
      })
      .catch(err => console.error(err));
  }, []);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!name || !text) return alert("Please enter your name and review.");

    const newReview = {
      img: "default_avatar.png",
      name,
      text,
      rating: parseInt(rating),
      isNew: true, // mark as new
      created_at: new Date().toISOString()
    };

    try {
      // Send review to backend
      await axios.post("http://localhost:5000/api/reviews", newReview);

      if (newReview.rating >= 3) {
        setReviews([newReview, ...reviews]);

        // Scroll directly to the first review card
        setTimeout(() => {
          const firstCard = document.querySelector(".testimonials-container .testimonial-card");
          if (firstCard) {
            firstCard.scrollIntoView({ behavior: "smooth", block: "center", inline: "start" });
          }
        }, 100);
      }

      setName("");
      setText("");
      setRating(5);
    } catch (err) {
      console.error(err);
      alert("Failed to submit review. Please try again later.");
    }
  };


  return (
    <div className="home-wrapper page-entry-animate">
      {/* HERO SECTION */}
      <section
        className="hero-section"
        style={{ backgroundImage: `url(${heroImg ? `http://localhost:5000/images/${heroImg}` : ""})` }}
      >
        <div className="hero-overlay"></div>
        <Container className="hero-content">
          <Row className="align-items-center">
            <Col md={6} className="animate-left">
              <h1 className="hero-title">
                Your <span>Mental Wellness</span> Companion 🌿
              </h1>
              <p className="hero-text">
                Improve your mood, reduce stress, cultivate mindfulness,
                nurture emotional balance, and build a happier, healthier you — one day at a time.
              </p>
              <Link to="/book-appointment" className="btn-gold hero-btn">Get Started</Link>
            </Col>
            <Col md={6} className="text-center animate-right">
              {heroImg && (
                <img
                  src={`http://localhost:5000/images/${heroImg}`}
                  alt="Hero"
                  className="hero-image"
                />
              )}
            </Col>
          </Row>
        </Container>
      </section>

      {/* FEATURES SECTION */}
      <section className={`features-section ${scrolled ? "visible" : ""}`}>
        <Container>
          <Row>
            {features.map((feat, idx) => (
              <Col md={4} key={idx}>
                <Card
                  className="feature-card glass-card animate-up"
                  style={{ animationDelay: `${feat.delay || 0}s` }}
                >
                  <Card.Body>
                    <h3>{feat.title}</h3>
                    <p >{feat.description}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials-section">
        <Container>
          <h2 className="section-title">What Users Say</h2>
          <div className="testimonials-container">
            {reviews.map((rev, idx) => (
              <div
                key={idx}
                className={`testimonial-card glass-card ${rev.isNew ? "new" : ""}`}
              >
                <img
                  src={`http://localhost:5000/images/${rev.img}`}
                  alt="avatar"
                  className="testimonial-avatar"
                />
                <p className="testimonial-text">"{rev.text}"</p>
                <h5 className="testimonial-name">
                  {rev.name} {rev.verified && <span className="verified">✔</span>}
                </h5>
                <div className="rating">{Array(rev.rating).fill("⭐")}</div>
                <small className="testimonial-date">
                  {new Date(rev.created_at).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </small>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* SUBMIT REVIEW */}
      <section className="submit-review-section">
        <Container>
          <h2 className="section-title">Submit Your Review</h2>
          <Form className="review-form glass-card" onSubmit={handleSubmitReview}>
            <Row className="mb-3 gx-2 gy-2">
              <Col md={6}>
                <Form.Control
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Col>
              <Col md={6}>
                <Form.Select
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                >
                  <option value={5}>5 - Excellent</option>
                  <option value={4}>4 - Good</option>
                  <option value={3}>3 - Average</option>
                  <option value={2}>2 - Poor</option>
                  <option value={1}>1 - Terrible</option>
                </Form.Select>
              </Col>
            </Row>

            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Your Review..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="mb-3"
            />

            <Button type="submit" className="btn-gold w-100">
              Submit Review
            </Button>
          </Form>
        </Container>
      </section>
    </div>
  );
};

export default Home;
