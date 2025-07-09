import { offers } from '../../data/offers';
import './Offers.css';

const Offers = () => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="offers-container">
      <h1 className="offers-title">¡Ofertas Especiales!</h1>
      <p className="offers-subtitle">Aprovecha nuestros descuentos por tiempo limitado</p>

      <div className="offers-grid">
        {offers.map((offer) => (
          <div key={offer.id} className="offer-card">
            <div className="offer-badge">
              -{offer.discountPercentage}%
            </div>
            <img src={offer.image} alt={offer.name} className="offer-image" />
            <div className="offer-info">
              <h3 className="offer-name">{offer.name}</h3>
              <p className="offer-category">{offer.category}</p>
              <p className="offer-description">{offer.description}</p>
              <div className="offer-price-container">
                <span className="offer-original-price">
                  S/ {offer.originalPrice.toFixed(2)}
                </span>
                <span className="offer-price">
                  S/ {offer.price.toFixed(2)}
                </span>
              </div>
              <p className="offer-valid-until">
                Válido hasta: {formatDate(offer.validUntil)}
              </p>   
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Offers; 