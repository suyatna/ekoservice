export const KartuTeknisi = ({ nama, rating, area }: { nama: string; rating: string; area: string }) => (
  <div className="kartu p-4"><p className="font-semibold">{nama}</p><p className="text-sm text-redup">Rating {rating} • {area}</p></div>
);
