import React from 'react'

export default function LoadingModal({ message }: { message: string }) {
    return (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xl">
                <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-gray-700 dark:text-gray-300">{message}</span>
                </div>
            </div>
        </div>
    )
}
