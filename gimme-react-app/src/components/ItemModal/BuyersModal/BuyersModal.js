import { createContext, useEffect, useRef, useState } from "react";
import { makePost } from "../../../tools/APIRequests";

import { NavLink } from "react-router-dom";

import classes from "./BuyersModal.module.scss";
import { useOnClickOutside } from "../../../tools/CustomHooks";
import { AuthContext } from "../../../store/auth-context";

function BuyersModal(props) {
    const ctx = createContext(AuthContext);
    const modalRef = useRef(null);
    const [buyers, setBuyers] = useState([]);
    const [buttonLabel, setButtonLabel] = useState("Join Buyer List");

    useOnClickOutside(modalRef, props.onClose);

    useEffect(async () => {
        if (props.buyers?.length > 0) {
            const list = await makePost("/users/idList", {
                idList: props.buyers,
            })
                .then((res) => res.json())
                .then((data) => {
                    return data.userList ? data.userList : [];
                });
            setBuyers(list);
        }
    }, [props.buyers]);

    useEffect(() => {
        if (props.buyersList?.length > 0) {
            setBuyers(props.buyersList);
        }
    }, [props.buyersList]);

    useEffect(() => {
        if (buyers.map((buyer) => buyer._id).includes(ctx.currentUser?._id))
            setButtonLabel("Leave Buyer List");
        else setButtonLabel("Join Buyer List");
    }, [buyers, ctx]);

    const handleJoinBuyers = () => {
        console.log("joining buyers");
    };

    return (
        <div className={classes.BuyersModal} ref={modalRef}>
            <h2 className={classes.BuyersModal__heading}>Bought By:</h2>
            <div
                className={`${classes.Buyer} ${classes.Buyer__button}`}
                onClick={handleJoinBuyers}
            >
                <p className={classes.Buyer__buttonLabel}>{buttonLabel}</p>
            </div>

            {buyers.map((buyer, i) => (
                <div
                    className={classes.Buyer}
                    style={{ "--delay": `${500 + i * 50}ms` }}
                >
                    <h2 className={classes.Buyer__name}>{buyer.name}</h2>
                    <NavLink
                        to={`/${buyer.handle}`}
                        className={classes.Buyer__handle}
                    >
                        @{buyer.handle}
                    </NavLink>
                </div>
            ))}
        </div>
    );
}

export default BuyersModal;
