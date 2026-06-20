export function ProductDetailSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading product details" className="product-detail-skeleton">
      <div className="pp-section pb-0 pt-9">
        <div className="product-detail-skeleton__breadcrumb" />
      </div>
      <div className="pp-section product-detail-skeleton__body">
        <div className="product-detail-skeleton__header" />
        <div className="product-detail-skeleton__banner" />
        <div className="product-detail-skeleton__grid">
          <div className="product-detail-skeleton__column">
            <div className="product-detail-skeleton__image" />
            <div className="product-detail-skeleton__card" />
          </div>
          <div className="product-detail-skeleton__column">
            <div className="product-detail-skeleton__card product-detail-skeleton__card--tall" />
          </div>
        </div>
      </div>
    </div>
  );
}
