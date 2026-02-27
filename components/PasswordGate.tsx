import React, { useState, useEffect } from 'react';

export const PasswordGate = ({ children }: { children: React.ReactNode }) => {
    const [storeNumber, setStoreNumber] = useState('');
    const [birthday, setBirthday] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check if user is already authenticated
        const auth = localStorage.getItem('album_authenticated');
        if (auth === 'true') {
            setIsAuthenticated(true);
        }
        setIsLoading(false);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const correctStoreNumber = import.meta.env.VITE_STORE_NUMBER;
        const correctBirthday = import.meta.env.VITE_BIRTHDAY;

        if (storeNumber === correctStoreNumber && birthday === correctBirthday) {
            setIsAuthenticated(true);
            localStorage.setItem('album_authenticated', 'true');
            setError('');
        } else {
            setError('店舗番号または誕生日が違います');
            setStoreNumber('');
            setBirthday('');
        }
    };

    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-[#f3f4f6] flex items-center justify-center">
                <div className="text-slate-600">読み込み中...</div>
            </div>
        );
    }

    if (isAuthenticated) {
        return <>{children}</>;
    }

    return (
        <div className="fixed inset-0 bg-[#f3f4f6] flex items-center justify-center p-4">
            <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20 max-w-md w-full">
                <h1 className="text-3xl md:text-4xl text-slate-800 font-bold mb-2 text-center serif">
                    栞へのアルバム
                </h1>
                <p className="text-slate-600 text-center mb-8 text-sm">
                    アルバムを開くには情報を入力してください
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            アトレ1店の店舗番号を入れやがれ！！
                        </label>
                        <input
                            type="text"
                            value={storeNumber}
                            onChange={(e) => setStoreNumber(e.target.value)}
                            placeholder="例: 1234"
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all text-center text-lg tracking-wider"
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            てめえの誕生日（MMDD）を入れやがれ！！
                        </label>
                        <input
                            type="text"
                            value={birthday}
                            onChange={(e) => setBirthday(e.target.value)}
                            placeholder="例: 0101"
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all text-center text-lg tracking-wider"
                        />
                    </div>

                    {error && (
                        <p className="text-red-500 text-sm text-center animate-pulse">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-slate-800 text-white py-3 rounded-lg hover:bg-slate-700 transition-colors font-medium"
                    >
                        開く
                    </button>
                </form>
            </div>
        </div>
    );
};
