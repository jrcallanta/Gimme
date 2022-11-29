import { useContext, useEffect, useRef, useState } from "react";
import { makePost } from "../../../tools/APIRequests";

import { NavLink } from "react-router-dom";

import classes from "./BuyersModal.module.scss";
import { useOnClickOutside } from "../../../tools/CustomHooks";
import { AuthContext } from "../../../store/auth-context";

function BuyersModal(props) {
    const modalRef = useRef(null);
    const ctx = useContext(AuthContext);
    const [buttonLabel, setButtonLabel] = useState("Join Buyer List");

    useOnClickOutside(modalRef, props.onClose);

    useEffect(() => {
        if (
            props.buyers
                .map((buyer) => buyer.userId)
                .includes(ctx.currentUser?._id)
        )
            setButtonLabel("Leave Buyer List");
        else setButtonLabel("Join Buyer List");
    }, [props.buyers, ctx.currentUser]);

    const handleButtonClick = () => {
        console.log("joining buyers");

        const payload = {
            type: !props.buyers
                .map(({ userId }) => userId)
                .includes(ctx.currentUser._id)
                ? "join"
                : "leave",
            userId: ctx.currentUser._id,
        };

        props.onUpdateBuyers(payload);
    };

    const handleLeaveBuyers = () => {
        console.log("leaving buyers");

        const payload = {
            type: "leave",
            userId: ctx.currentUser._id,
        };

        props.onUpdateBuyers(payload);
    };

    const handleToggleStatus = (buyer) => {
        if (buyer.userId === ctx.currentUser._id) {
            console.log("updating status");

            const payload = {
                type: "update",
                userId: ctx.currentUser._id,
                status:
                    buyer.status === "interested" ? "purchased" : "interested",
            };

            props.onUpdateBuyers(payload);
        }
    };

    return (
        <div className={classes.BuyersModal} ref={modalRef}>
            <h2 className={classes.BuyersModal__heading}>Bought By:</h2>
            <div className={classes.BuyerButton} onClick={handleButtonClick}>
                <p className={classes.BuyerButton__text}>{buttonLabel}</p>
            </div>

            <div className={classes.BuyersList}>
                {props.buyers.map((buyer, i) => (
                    <div
                        className={classes.Buyer}
                        style={{
                            "--delay": `${
                                500 + (props.buyers.length - 1 * 50 - i * 50)
                            }ms`,
                        }}
                    >
                        <div className={classes.Buyer__user}>
                            {/* <h2 className={classes.Buyer__user__name}>
                            {buyer.name}
                        </h2> */}
                            <NavLink
                                to={`/${buyer.handle}`}
                                className={classes.Buyer__user__handle}
                            >
                                @{buyer.handle}
                            </NavLink>
                        </div>

                        <div
                            className={classes.Buyer__status}
                            onClick={() => handleToggleStatus(buyer)}
                            data-buyer-status={buyer.status}
                            data-toggle-enabled={
                                buyer.userId === ctx.currentUser._id
                            }
                        >
                            <h2 className={classes.Buyer__status__text}>
                                {buyer.status}
                            </h2>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default BuyersModal;
