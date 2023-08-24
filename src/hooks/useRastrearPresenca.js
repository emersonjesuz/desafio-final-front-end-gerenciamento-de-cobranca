import { usePresence } from "framer-motion"
import { useEffect } from "react";

export default function useRastrearPresenca() {
    const [isPresent, safeToRemove] = usePresence();

    useEffect(() => {
        !isPresent && setTimeout(safeToRemove(), 1000)
    }, [isPresent])
}