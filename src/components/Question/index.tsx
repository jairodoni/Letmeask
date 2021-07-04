import { ReactNode } from "react";
import cn from 'classnames'
import "./styles.scss"

interface QuestionProps {
  content: string;
  author: {
    name: string;
    avatar: string;
  }
  isAnswered?: boolean;
  isHighlighted?: boolean;
  createdAt?: Date;
  children?: ReactNode;
}

export function Question({
  children,
  content,
  author,
  isAnswered = false,
  isHighlighted = false
}: QuestionProps) {
  return (
    <div
      className={cn(
        'question',
        { answered: isAnswered },
        { highlighted: isHighlighted && !isAnswered }
      )}
    >
      <p>{content}</p>
      <footer>
        <div className="user-info">
          <img src={author.avatar} alt={author.name} />
          <span>{author.name}</span>
        </div>
        <div>
          {children}
        </div>
      </footer>
    </div>
  );
};