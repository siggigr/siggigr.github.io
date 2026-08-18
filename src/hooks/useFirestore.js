import { useEffect, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../firebase";

/** Live subscription to a single document, e.g. "siteContent/about". */
export function useDoc(path) {
  const [data, setData] = useState(null);
  useEffect(() => {
    return onSnapshot(doc(db, path), (snap) => {
      setData(snap.exists() ? snap.data() : null);
    });
  }, [path]);
  return data;
}

/**
 * Live subscription to a collection, ordered by the numeric `order`
 * field (every document created by this app sets it to Date.now()).
 */
export function useCollection(name) {
  const [items, setItems] = useState([]);
  useEffect(() => {
    const q = query(collection(db, name), orderBy("order"));
    return onSnapshot(q, (snap) => {
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
  }, [name]);
  return items;
}
