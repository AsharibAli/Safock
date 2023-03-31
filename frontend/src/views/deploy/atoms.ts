import { truncateDecimals } from "./../../utils/index";
import { t } from "@lingui/macro";
import { atom } from "jotai";

export interface Collateral {
    symbol: string;
    address: string;
    targetUnit: string;
    rewardToken?: string;
    custom?: boolean;
}

export interface BackupUnitBasket {
    diversityFactor: number;
    collaterals: Collateral[];
}

export interface BackupBasket {
    [x: string]: BackupUnitBasket;
}

export interface PrimaryUnitBasket {
    scale: string;
    collaterals: Collateral[];
    distribution: string[];
}

export interface Basket {
    [x: string]: PrimaryUnitBasket;
}

export const basketAtom = atom<Basket>({});
export const backupCollateralAtom = atom<BackupBasket>({});
export const isBasketValidAtom = atom((get) => {
    return !!Object.keys(get(basketAtom)).length;
});

export const getCollateralFromBasket = (basket: Basket | BackupBasket) => {
    return Object.values(basket).reduce(
        (acc, { collaterals }) => [...acc, ...collaterals.map((c: any) => c.address)],
        [] as string[]
    );
};

const getCollateralByTarget = (collaterals: Collateral[]) => {
    return collaterals.reduce((acc, collateral) => {
        acc[collateral.targetUnit] = [...(acc[collateral.targetUnit] ?? []), collateral];

        return acc;
    }, {} as { [x: string]: Collateral[] });
};

export const isValidBasketAtom = atom((get): [boolean, string[]] => {
    const basket = get(basketAtom);
    const backup = get(backupCollateralAtom);
    const errors: string[] = [];

    const units = Object.keys(basket);

    if (!units.length) {
        errors.push(t`Primary basket not defined`);
    }

    for (const targetUnit of units) {
        const distribution = basket[targetUnit].distribution.reduce(
            (acc, n) => acc + Number(n),
            0
        );
        if (distribution !== 100) {
            errors.push(t`Invalid (${targetUnit}) basket distribution`);
        }

        if (Number(basket[targetUnit].scale) <= 0) {
            errors.push(t`Invalid (${targetUnit}) basket scale`);
        }

        if (backup[targetUnit]) {
            const { diversityFactor } = backup[targetUnit];
            const collaterals = backup[targetUnit].collaterals.length;

            if (collaterals && (diversityFactor > collaterals || diversityFactor <= 0)) {
                errors.push(t`Invalid (${targetUnit}) backup diversity factor`);
            }
        }
    }

    return [!errors.length, errors];
});

export const primaryBasketCollateralAtom = atom((get) => {
    return getCollateralFromBasket(get(basketAtom));
});

export const backupBasketCollateralAtom = atom((get) => {
    return getCollateralFromBasket(get(backupCollateralAtom));
});

export const addBackupCollateralAtom = atom(null, (get, set, collaterals: Collateral[]) => {
    const basket = { ...get(backupCollateralAtom) };
    const collateralByTarget = getCollateralByTarget(collaterals);

    for (const unit of Object.keys(collateralByTarget)) {
        const unitCollaterals = [
            ...collateralByTarget[unit],
            ...(basket[unit]?.collaterals ?? []),
        ];

        basket[unit] = {
            collaterals: unitCollaterals,
            diversityFactor: basket[unit]?.diversityFactor ?? Math.min(3, unitCollaterals.length),
        };
    }

    set(backupCollateralAtom, basket);
});

export const addBasketCollateralAtom = atom(null, (get, set, collaterals: Collateral[]) => {
    const basket = { ...get(basketAtom) };
    const collateralByTarget = getCollateralByTarget(collaterals);

    for (const unit of Object.keys(collateralByTarget)) {
        const unitCollaterals = [
            ...collateralByTarget[unit],
            ...(basket[unit]?.collaterals ?? []),
        ];

        const distribution = new Array(unitCollaterals.length - 1).fill(
            truncateDecimals(100 / unitCollaterals.length)
        );
        const sum = distribution.reduce((a, b) => a + b, 0);
        distribution.push(100 - sum);

        basket[unit] = {
            collaterals: unitCollaterals,
            distribution,
            scale: basket[unit]?.scale ?? 1,
        };
    }

    set(basketAtom, basket);
});

export const updateBackupBasketUnitAtom = atom(
    null,
    (get, set, [unit, data]: [string, BackupUnitBasket]) => {
        const basket = { ...get(backupCollateralAtom) };

        if (!data.collaterals.length) {
            delete basket[unit];
        } else {
            basket[unit] = { ...basket[unit], ...data };
        }

        set(backupCollateralAtom, basket);
    }
);

export const updateBasketUnitAtom = atom(
    null,
    (get, set, [unit, data]: [string, PrimaryUnitBasket]) => {
        const basket = { ...get(basketAtom) };

        if (!data.collaterals.length) {
            delete basket[unit];
            const backup = { ...get(backupCollateralAtom) };
            delete backup[unit];
            set(backupCollateralAtom, backup);
        } else {
            basket[unit] = { ...basket[unit], ...data };
        }

        set(basketAtom, basket);
    }
);

export enum DeploymentSteps {
    Intro,
    Params,
    Basket,
    Summary,
    TokenDeploy,
    Overview,
    Governance,
    GovernanceDeploy,
}

export const deployIdAtom = atom("");

export const currentStepAtom = atom(DeploymentSteps.Intro);
